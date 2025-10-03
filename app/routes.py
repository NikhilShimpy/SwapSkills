from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from firebase_admin import storage
from .firebase_config import db, bucket
from datetime import datetime
import random
from math import ceil

main = Blueprint('main', __name__)


# ------------------ Helper ------------------
def generate_random_rating():
    value = round(random.uniform(1, 5), 1)
    return int(value) if value.is_integer() else value


# ------------------ Home ------------------
@main.route('/')
def home():
    query = request.args.get('q', '').lower()
    page = int(request.args.get('page', 1))
    per_page = 10

    users_ref = db.collection('users').stream()
    user_data = []

    for doc in users_ref:
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


# ------------------ Profile ------------------
@main.route('/profile', methods=['GET', 'POST'])
def profile():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('main.login'))

    user_ref = db.collection('users').document(user_id)

    if request.method == 'POST':
        name = request.form.get('name')
        location = request.form.get('location')
        offered_skill_raw = request.form.get('offeredSkill', '')
        requested_skill_raw = request.form.get('requestedSkill', '')
        availability = request.form.get('availability')
        visibility = request.form.get('visibility')
        photo_url = request.form.get('photo_url') or "/static/default-profile.png"

        new_offered_skills = [s.strip() for s in offered_skill_raw.split(',') if s.strip()]
        new_requested_skills = [s.strip() for s in requested_skill_raw.split(',') if s.strip()]

        existing_data = user_ref.get().to_dict() or {}
        merged_offered = list(set(existing_data.get('offeredSkill', []) + new_offered_skills))
        merged_requested = list(set(existing_data.get('requestedSkill', []) + new_requested_skills))

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


# ------------------ View Swap Profile ------------------
@main.route('/swap/<user_id>')
def view_swap_profile(user_id):
    current_user_id = session.get('user_id')
    if not current_user_id:
        return redirect(url_for('main.login'))

    if user_id == current_user_id:
        return redirect(url_for('main.profile'))

    current_user_doc = db.collection('users').document(current_user_id).get()
    current_user_data = current_user_doc.to_dict() if current_user_doc.exists else {}

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


# ------------------ Swap Request ------------------
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
        return redirect(url_for('main.home'))

    return render_template(
        'swap_request.html',
        current_user_skills=current_user_data.get('offeredSkill', []),
        target_user_requested_skills=target_user_data.get('requestedSkill', [])
    )


# ------------------ Auth ------------------
@main.route('/login')
def login():
    return render_template('signin.html')


@main.route('/signup')
def signup():
    return render_template('signup.html')


@main.route('/set-session', methods=['POST'])
def set_session():
    data = request.get_json()
    session['user_id'] = data.get('user_id')
    return jsonify({'status': 'success'})


# ------------------ Swap Requests Page ------------------
@main.route('/see-request', methods=['GET'])
def see_request():
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


# ------------------ Update Status ------------------
@main.route('/update-status/<swap_id>', methods=['POST'])
def update_status(swap_id):
    action = request.form.get('action')  # 'Accepted' or 'Rejected'

    if action == 'Accepted':
        db.collection('swaps').document(swap_id).update({'status': 'Accepted'})
    elif action == 'Rejected':
        db.collection('swaps').document(swap_id).delete()

    return redirect(url_for('main.see_request'))
