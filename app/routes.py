from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from firebase_admin import storage, firestore
from .firebase_config import db, bucket
from datetime import datetime
import random
from math import ceil

main = Blueprint('main', __name__)

# ------------------ Helper ------------------
def generate_random_rating():
    value = round(random.uniform(1, 5), 1)
    return int(value) if value.is_integer() else value

# ------------------ Landing Page ------------------
@main.route('/')
def landing():
    """Landing page for non-authenticated users"""
    if session.get('user_id'):
        return redirect(url_for('main.app'))
    return render_template('landing.html')

# ------------------ Home Route (for backward compatibility) ------------------
@main.route('/home')
def home():
    """Redirect to app home for backward compatibility"""
    return redirect(url_for('main.app'))

# ------------------ App Home ------------------
@main.route('/app')
def app():
    """Main app page for authenticated users"""
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('main.login'))
    
    query = request.args.get('q', '').strip().lower()
    page = int(request.args.get('page', 1))
    per_page = 12

    # Get total user count from Firebase
    users_ref = db.collection('users')
    total_users_query = users_ref.where('profileVisibility', '==', 'Public').stream()
    total_users = len(list(total_users_query))

    # Fetch ALL users from Firebase
    users_ref = db.collection('users').stream()
    user_data = []

    for doc in users_ref:
        user = doc.to_dict()
        user_id = doc.id

        # Skip users who are not public
        if user.get('profileVisibility', 'Public') != 'Public':
            continue

        # Get location data
        city = user.get('city', '')
        state = user.get('state', '')
        location = user.get('location', '')
        
        # Create display location
        if city and state:
            display_location = f"{city}, {state}"
        elif city:
            display_location = city
        elif location:
            display_location = location
        else:
            display_location = "Location not specified"

        # Get skills
        offered_skills = [skill.lower() for skill in user.get('offeredSkill', [])]
        requested_skills = [skill.lower() for skill in user.get('requestedSkill', [])]
        
        # Get user name
        user_name = user.get('name', '').lower()
        
        # Enhanced search functionality - ONLY search by name and offered skills
        matches_search = False
        if not query:
            matches_search = True  # Show all if no query
        else:
            # Search in user name
            if query in user_name:
                matches_search = True
            
            # Search in offered skills (EXACT MATCH or CONTAINS)
            for skill in offered_skills:
                if query in skill or query == skill:
                    matches_search = True
                    break
        
        # Only add user if they match the search criteria
        if matches_search:
            user_data.append({
                'name': user.get('name', 'Anonymous'),
                'photo_url': user.get('photo_url', '/static/default-profile.png'),
                'offeredSkill': user.get('offeredSkill', []),
                'requestedSkill': user.get('requestedSkill', []),
                'rating': generate_random_rating(),
                'user_id': doc.id,
                'city': city,
                'state': state,
                'location': location,
                'display_location': display_location,
                'availability': user.get('availability', '')
            })

    # Sort users by name
    user_data.sort(key=lambda x: x['name'])

    # Get AI recommendations for logged-in users
    ai_recommendations = []
    current_user_id = session.get('user_id')
    is_authenticated = bool(current_user_id)
    
    if current_user_id:
        current_user_doc = db.collection('users').document(current_user_id).get()
        if current_user_doc.exists:
            current_user_data = current_user_doc.to_dict()
            wanted_skills = current_user_data.get('requestedSkill', [])
            
            for skill in wanted_skills:
                if not skill.strip():
                    continue
                    
                skill_users = db.collection('users').where('offeredSkill', 'array_contains', skill.strip()).stream()
                
                for doc in skill_users:
                    user = doc.to_dict()
                    user_id = doc.id
                    
                    if (user.get('profileVisibility', 'Public') != 'Public' or 
                        user_id == current_user_id or
                        any(rec['user_id'] == user_id for rec in ai_recommendations)):
                        continue
                    
                    # Get location for recommendations too
                    city = user.get('city', '')
                    state = user.get('state', '')
                    location = user.get('location', '')
                    
                    if city and state:
                        display_location = f"{city}, {state}"
                    elif city:
                        display_location = city
                    elif location:
                        display_location = location
                    else:
                        display_location = "Location not specified"
                    
                    ai_recommendations.append({
                        'name': user.get('name', 'Anonymous'),
                        'photo_url': user.get('photo_url', '/static/default-profile.png'),
                        'offeredSkill': user.get('offeredSkill', []),
                        'requestedSkill': user.get('requestedSkill', []),
                        'rating': generate_random_rating(),
                        'user_id': user_id,
                        'display_location': display_location
                    })
                    
                    if len(ai_recommendations) >= 6:
                        break
                
                if len(ai_recommendations) >= 6:
                    break

    # Pagination
    total_filtered_users = len(user_data)
    total_pages = ceil(total_filtered_users / per_page) if total_filtered_users > 0 else 1
    
    # Ensure page is within valid range
    if page < 1:
        page = 1
    elif page > total_pages and total_pages > 0:
        page = total_pages
    
    start = (page - 1) * per_page
    end = start + per_page
    paginated_users = user_data[start:end]

    return render_template(
        'index.html',
        swaps=paginated_users,
        current_page=page,
        total_pages=total_pages,
        query=query,
        total_users=total_users,
        ai_recommendations=ai_recommendations,
        is_authenticated=is_authenticated,
        search_results_count=total_filtered_users
    )

# ------------------ Enhanced Search API Endpoint ------------------
@main.route('/api/search_users', methods=['GET'])
def api_search_users():
    """API endpoint for searching users across entire database"""
    try:
        query = request.args.get('q', '').strip().lower()
        users_ref = db.collection('users').stream()
        
        search_results = []
        
        for doc in users_ref:
            user = doc.to_dict()
            user_id = doc.id

            if user.get('profileVisibility', 'Public') != 'Public':
                continue

            # Get user name and skills
            user_name = user.get('name', '').lower()
            offered_skills = [skill.lower() for skill in user.get('offeredSkill', [])]
            
            # Check if matches search query
            matches = False
            if not query:
                matches = True
            else:
                # Search in user name
                if query in user_name:
                    matches = True
                
                # Search in offered skills
                if not matches:
                    for skill in offered_skills:
                        if query in skill or query == skill:
                            matches = True
                            break
            
            if matches:
                # Get location
                city = user.get('city', '')
                state = user.get('state', '')
                if city and state:
                    display_location = f"{city}, {state}"
                elif city:
                    display_location = city
                else:
                    display_location = user.get('location', 'Location not specified')
                
                search_results.append({
                    'name': user.get('name', 'Anonymous'),
                    'photo_url': user.get('photo_url', '/static/default-profile.png'),
                    'offeredSkill': user.get('offeredSkill', []),
                    'requestedSkill': user.get('requestedSkill', []),
                    'rating': generate_random_rating(),
                    'user_id': user_id,
                    'display_location': display_location
                })
        
        return jsonify({
            'status': 'success',
            'count': len(search_results),
            'results': search_results[:10]  # Limit to 10 results for performance
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

# ------------------ Auth Routes ------------------
@main.route('/login')
def login():
    if session.get('user_id'):
        return redirect(url_for('main.app'))
    return render_template('signin.html')

@main.route('/signup')
def signup():
    if session.get('user_id'):
        return redirect(url_for('main.app'))
    return render_template('signup.html')

@main.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main.landing'))

@main.route('/set-session', methods=['POST'])
def set_session():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'status': 'error', 'error': 'No user ID provided'}), 400
        
        # Set session
        session['user_id'] = user_id
        session['logged_in'] = True
        
        return jsonify({'status': 'success', 'message': 'Session set successfully'})
        
    except Exception as e:
        print(f"Session error: {str(e)}")
        return jsonify({'status': 'error', 'error': str(e)}), 500

# ------------------ Profile Routes ------------------
@main.route('/profile')
def profile():
    """User profile page"""
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('main.login'))
    
    # Get user data from Firestore
    user_doc = db.collection('users').document(user_id).get()
    
    if user_doc.exists:
        user_data = user_doc.to_dict()
    else:
        user_data = {}
    
    return render_template('profile.html', user_data=user_data)

@main.route('/edit-profile', methods=['GET', 'POST'])
def edit_profile():
    """Edit user profile"""
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('main.login'))
    
    if request.method == 'POST':
        # Handle profile update
        name = request.form.get('name')
        offered_skills = request.form.get('offeredSkill', '').split(',')
        requested_skills = request.form.get('requestedSkill', '').split(',')
        location = request.form.get('location', '')
        city = request.form.get('city', '')
        state = request.form.get('state', '')
        availability = request.form.get('availability', '')
        profile_visibility = request.form.get('profileVisibility', 'Public')
        
        # Clean up skills (remove empty strings and strip whitespace)
        offered_skills = [skill.strip() for skill in offered_skills if skill.strip()]
        requested_skills = [skill.strip() for skill in requested_skills if skill.strip()]
        
        update_data = {
            'name': name,
            'offeredSkill': offered_skills,
            'requestedSkill': requested_skills,
            'location': location,
            'city': city,
            'state': state,
            'availability': availability,
            'profileVisibility': profile_visibility,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        # Update in Firestore
        db.collection('users').document(user_id).update(update_data)
        
        return redirect(url_for('main.profile'))
    
    # GET request - load current user data
    user_doc = db.collection('users').document(user_id).get()
    user_data = user_doc.to_dict() if user_doc.exists else {}
    
    return render_template('edit_profile.html', user_data=user_data)

# ------------------ Swap Routes ------------------
@main.route('/request_swap/<target_user_id>', methods=['GET', 'POST'])
def request_swap(target_user_id):
    """Request a skill swap with another user"""
    current_user_id = session.get('user_id')
    if not current_user_id:
        return redirect(url_for('main.login'))

    current_user_doc = db.collection('users').document(current_user_id).get()
    current_user_data = current_user_doc.to_dict() if current_user_doc.exists else {}

    target_user_doc = db.collection('users').document(target_user_id).get()
    target_user_data = target_user_doc.to_dict() if target_user_doc.exists else {}

    if request.method == 'POST':
        swap_data = {
            'fromUserId': current_user_id,
            'toUserId': target_user_id,
            'offeredSkill': request.form.get('your_skill'),
            'requestedSkill': request.form.get('their_skill'),
            'message': request.form.get('message'),
            'status': 'pending',
            'createdAt': datetime.now()
        }
        db.collection('swaps').add(swap_data)
        return redirect(url_for('main.app'))

    return render_template(
        'swap_request.html',
        current_user_skills=current_user_data.get('offeredSkill', []),
        target_user_requested_skills=target_user_data.get('requestedSkill', []),
        target_user_id=target_user_id
    )

@main.route('/swap/<user_id>')
def view_swap_profile(user_id):
    """View another user's profile for swapping"""
    current_user_id = session.get('user_id')
    if not current_user_id:
        return redirect(url_for('main.login'))

    if user_id == current_user_id:
        return redirect(url_for('main.profile'))

    # Get current user data
    current_user_doc = db.collection('users').document(current_user_id).get()
    current_user_data = current_user_doc.to_dict() if current_user_doc.exists else {}

    # Get target user data
    target_user_doc = db.collection('users').document(user_id).get()
    user_data = target_user_doc.to_dict() if target_user_doc.exists else None

    if not user_data:
        return "<h2>User not found</h2>", 404

    return render_template(
        "swap_profile.html",
        user_data=user_data,
        target_user_id=user_id,
        current_user_data=current_user_data
    )

# ------------------ Swap Requests Management ------------------
@main.route('/see-request', methods=['GET'])
def see_request():
    """View swap requests"""
    current_user_id = session.get('user_id')
    if not current_user_id:
        return redirect(url_for('main.login'))

    current_user_doc = db.collection('users').document(current_user_id).get()
    current_user_data = current_user_doc.to_dict() if current_user_doc.exists else {}

    view_type = request.args.get('view', 'invitations')
    swap_requests = []

    if view_type == 'invitations':
        query = db.collection('swaps').where('toUserId', '==', current_user_id)
    else:
        query = db.collection('swaps').where('fromUserId', '==', current_user_id)

    for doc in query.stream():
        data = doc.to_dict()
        user_id_ref = data['fromUserId'] if view_type == 'invitations' else data['toUserId']

        user_doc_snapshot = db.collection('users').document(user_id_ref).get()
        user_doc = user_doc_snapshot.to_dict() if user_doc_snapshot.exists else {}

        data['fromUserName'] = user_doc.get('name', 'Unknown')
        data['fromUserPhoto'] = user_doc.get('photo_url', '/static/default-profile.png')
        data['fromUserRating'] = user_doc.get('rating', 'N/A')
        data['id'] = doc.id
        swap_requests.append(data)

    return render_template(
        'seeRequest.html',
        swap_requests=swap_requests,
        selected_status='',
        current_user_data=current_user_data,
        view_type=view_type
    )

@main.route('/update-status/<swap_id>', methods=['POST'])
def update_status(swap_id):
    """Update swap request status"""
    action = request.form.get('action')

    if action == 'Accepted':
        db.collection('swaps').document(swap_id).update({'status': 'Accepted'})
    elif action == 'Rejected':
        db.collection('swaps').document(swap_id).delete()

    return redirect(url_for('main.see_request'))