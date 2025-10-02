from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from firebase_admin import storage
from .firebase_config import db, bucket
from datetime import datetime
import random
from math import ceil

main = Blueprint('main', __name__)



# Home Page Route (Updated to use `users` collection)

@main.route('/')
def home():
    query = request.args.get('q', '').lower()
    page = int(request.args.get('page', 1))  # current page from query param
    per_page = 10  # how many users to show per page

    users_ref = db.collection('users')
    users_docs = users_ref.stream()

    user_data = []

    for doc in users_docs:
        user = doc.to_dict()
        user_id = doc.id

        if user.get('profileVisibility', 'Public') != 'Public':
            continue

        availability = user.get('availability', '')
        if isinstance(availability, list):
            availability = ", ".join(availability)

        search_blob = " ".join([
            user.get('name', ''),
            " ".join(user.get('offeredSkill', [])),
            " ".join(user.get('requestedSkill', [])),
            user.get('location', ''),
            availability
        ]).lower()

        if query and query not in search_blob:
            continue

        user_data.append({
            'name': user.get('name', 'Anonymous'),
            'photo_url': user.get('photo_url', '/static/default-profile.png'),
            'offeredSkill': user.get('offeredSkill', []),
            'requestedSkill': user.get('requestedSkill', []),
            'rating': generate_random_rating(),
            'user_id': user_id
        })

    # pagination logic
    total_users = len(user_data)
    total_pages = ceil(total_users / per_page)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_users = user_data[start:end]

    return render_template(
        'index.html',
        swaps=paginated_users,
        current_page=page,
        total_pages=total_pages,
        query=query
    )
def generate_random_rating():
        value = round(random.uniform(1, 5), 1)
        return int(value) if value.is_integer() else value

# Profile Page Route

@main.route('/profile', methods=['GET', 'POST'])
def profile():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('main.login'))

    user_ref = db.collection('users').document(user_id)

    if request.method == 'POST':
        # Get and split skills
        name = request.form.get('name')
        location = request.form.get('location')
        offered_skill_raw = request.form.get('offeredSkill', '')
        requested_skill_raw = request.form.get('requestedSkill', '')
        availability = request.form.get('availability')
        visibility = request.form.get('visibility')
        photo_url = request.form.get('photo_url') or "/static/default-profile.png"

        new_offered_skills = [s.strip() for s in offered_skill_raw.split(',') if s.strip()]
        new_requested_skills = [s.strip() for s in requested_skill_raw.split(',') if s.strip()]

        # Merge with existing
        existing_data = user_ref.get().to_dict() or {}
        existing_offered = existing_data.get('offeredSkill', [])
        existing_requested = existing_data.get('requestedSkill', [])

        merged_offered = list(set(existing_offered + new_offered_skills))
        merged_requested = list(set(existing_requested + new_requested_skills))

        user_data = {
            'name': name,
            'location': location,
            'offeredSkill': merged_offered,
            'requestedSkill': merged_requested,
            'availability': availability,
            'profileVisibility': visibility,
            'photo_url': photo_url
        }

        user_ref.set(user_data)
        return redirect(url_for('main.profile'))

    user_doc = user_ref.get()
    user = user_doc.to_dict() if user_doc.exists else {}

    return render_template('profile.html', user_data=user)



# View Swap Profile

@main.route('/swap/<user_id>')
def view_swap_profile(user_id):
    current_user_id = session.get('user_id')

    if not current_user_id:
        return redirect(url_for('main.login'))

    # Redirect to profile page if the user clicks their own card
    if user_id == current_user_id:
        return redirect(url_for('main.profile'))

    # Get current (logged-in) user info (for avatar in header)
    current_user_doc = db.collection('users').document(current_user_id).get()
    current_user_data = current_user_doc.to_dict() if current_user_doc.exists else {}

    # Get the profile data of the clicked user
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



# Swap Request Page

@main.route('/request_swap/<target_user_id>', methods=['GET', 'POST'])
def request_swap(target_user_id):
    current_user_id = session.get('user_id')
    if not current_user_id:
        return redirect(url_for('main.login'))

    current_user_doc = db.collection('users').document(current_user_id).get()
    current_user_data = current_user_doc.to_dict() if current_user_doc.exists else {}

    target_user_doc = db.collection('users').document(target_user_id).get()
    target_user_data = target_user_doc.to_dict() if target_user_doc.exists else {}

    if request.method == 'POST':
        your_skill = request.form.get('your_skill')
        their_skill = request.form.get('their_skill')
        message = request.form.get('message')

        swap_data = {
            'fromUserId': current_user_id,
            'toUserId': target_user_id,
            'offeredSkill': your_skill,
            'requestedSkill': their_skill,
            'message': message,
            'status': 'pending',
            'createdAt': datetime.now()
        }

        db.collection('swaps').add(swap_data)
        return redirect(url_for('main.home'))

    return render_template(
        'swap_request.html',
        current_user_skills=current_user_data.get('offeredSkill', []),
        target_user_requested_skills=target_user_data.get('requestedSkill', [])
    )



# Auth Pages

@main.route('/login')
def login():
    return render_template('signin.html')

@main.route('/signup')
def signup():
    return render_template('signup.html')



# Firebase session (set from frontend after login/signup)

@main.route('/set-session', methods=['POST'])
def set_session():
    data = request.get_json()
    session['user_id'] = data.get('user_id')
    return jsonify({'status': 'success'})


@main.route('/swap-request', methods=['GET', 'POST'])
def swap_request():
    # Get current logged-in user ID
    current_user_id = session.get('user_id')

    if not current_user_id:
        return redirect(url_for('login'))

    # Fetch current user document
    current_user_ref = db.collection('users').document(current_user_id)
    current_user_doc = current_user_ref.get()

    if not current_user_doc.exists:
        return "User not found", 404

    current_user_data = current_user_doc.to_dict()
    current_user_skills = current_user_data.get('skillsOffered', [])

    # For GET request — fetch swap requests where current user is the target
    if request.method == 'GET':
        swap_requests = []
        swaps_ref = db.collection('swaps').where('toUserId', '==', current_user_id)
        results = swaps_ref.stream()

        for doc in results:
            data = doc.to_dict()
            # Fetch fromUser info
            from_user = db.collection('users').document(data['fromUserId']).get().to_dict()
            data['fromUserName'] = from_user.get('name', 'Unknown')
            data['fromUserRating'] = from_user.get('rating', 0)
            data['fromUserPhoto'] = from_user.get('profilePhoto', '')
            data['id'] = doc.id
            swap_requests.append(data)

        return render_template('swap_request.html', swap_requests=swap_requests)

    # For POST request — store a new swap request
    elif request.method == 'POST':
        your_skill = request.form.get('your_skill')
        their_skill = request.form.get('their_skill')
        message = request.form.get('message')
        to_user_id = request.args.get('to_user_id')

        if not to_user_id:
            return "Missing target user", 400

        swap_data = {
            "fromUserId": current_user_id,
            "toUserId": to_user_id,
            "offeredSkill": your_skill,
            "requestedSkill": their_skill,
            "message": message,
            "status": "Pending",
            "createdAt": datetime.utcnow()
        }

        db.collection('swaps').add(swap_data)
        return redirect(url_for('swap_request'))


# see request in prodile 
@main.route('/see-request', methods=['GET', 'POST'])
def see_request():
    current_user_id = session.get('user_id')
    if not current_user_id:
        return redirect(url_for('main.login'))

    current_user_doc = db.collection('users').document(current_user_id).get()
    current_user_data = current_user_doc.to_dict() if current_user_doc.exists else {}

    # status_filter = request.args.get('status')
    status_filter = None  # Disable status filtering

    view_type = request.args.get('view', 'invitations')  # default to invitations

    swap_requests = []

    if view_type == 'invitations':
        query = db.collection('swaps').where('toUserId', '==', current_user_id)
    else:  # my_requests
        query = db.collection('swaps').where('fromUserId', '==', current_user_id)

    # if status_filter:
    #     query = query.where('status', '==', status_filter)

    for doc in query.stream():
        data = doc.to_dict()
        # Swap user details (fromUser or toUser based on view)
        user_id_ref = data['fromUserId'] if view_type == 'invitations' else data['toUserId']
        user_doc = db.collection('users').document(user_id_ref).get().to_dict()

        data['fromUserName'] = user_doc.get('name', 'Unknown')
        data['fromUserPhoto'] = user_doc.get('photo_url', '/static/default-profile.png')
        data['fromUserRating'] = user_doc.get('rating', 'N/A')
        data['id'] = doc.id
        swap_requests.append(data)

    return render_template(
        'seeRequest.html',
        swap_requests=swap_requests,
        selected_status=status_filter or '',
        current_user_data=current_user_data,
        view_type=view_type
    )

@main.route('/update-status/<swap_id>', methods=['POST'])
@main.route('/update-status/<swap_id>', methods=['POST'])
@main.route('/update-status/<swap_id>', methods=['POST'])
def update_status(swap_id):
    action = request.form.get('action')  # 'Accepted' or 'Rejected'

    if action == 'Accepted':
        db.collection('swaps').document(swap_id).update({'status': 'Accepted'})
    elif action == 'Rejected':
        db.collection('swaps').document(swap_id).delete()

    return redirect(url_for('main.see_request'))



