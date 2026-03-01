# 🤝 Skill Swap Platform: Connect, Exchange & Learn Skills

[![View Live](https://img.shields.io/badge/View-Live-green?style=for-the-badge&logo=web)](https://swap-skills-bice.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-blue?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Database-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Developed by:** Nikhil Shimpy, Harsh Vardhan, Palak Paithari, Chetna Sikarwar

Skill Swap Platform is a community-driven web application where users can **list the skills they offer**, **browse skills offered by others**, **request skill swaps**, and **exchange feedback after successful swaps**. It empowers users to learn, share, and grow collaboratively in a structured skill-sharing environment.

> **Live Demo:** https://swap-skills-bice.vercel.app/

---

## � Table of Contents

- [👥 Contributors](#-contributors)
- [🔍 Features](#-features)
- [🛠️ Technologies Used](#️-technologies-used)
- [📁 Project Structure](#-project-structure)
- [📦 Installation & Setup](#-installation--setup)
- [🚀 Running the Application](#-running-the-application)
- [🔌 API Endpoints](#-api-endpoints)
- [🐛 Troubleshooting](#-troubleshooting)
- [📝 Contributing](#-contributing)
- [📄 License](#-license)



- **Nikhil Shimpy** – [@NikhilShimpy](https://github.com/NikhilShimpy)  
- **Harsh Vardhan** – [@Harsh147v](https://github.com/Harsh147v)
- **Palak Paithari** – [@palakpaithari](https://github.com/palakpaithari)
- **Chetna Sikarwar** – [@chetnasingh31](https://github.com/chetnasingh31)

---

## 🔍 Features

### **🧑‍💻 User Features**
- **Profile Management**
  - Add basic info: name, location (optional), profile photo (optional)
  - List of skills offered and skills wanted
  - Set availability: weekends, evenings, or custom timings
  - Choose to make profile public or private

- **Skill Browsing & Searching**
  - Search for specific skills (e.g., Photoshop, Excel)
  - Browse users based on skills offered

- **Swap Requests**
  - Request skills from other users
  - Accept or reject incoming swap requests
  - Delete a swap request if it is not accepted
  - View current, pending, and completed swaps

- **Ratings & Feedback**
  - Rate and provide feedback after a successful swap

### **🛠️ Admin Features**
- Monitor all swap requests: pending, accepted, or cancelled
- Reject inappropriate or spammy skill descriptions
- Ban users violating platform policies
- Send platform-wide messages (e.g., feature updates, downtime alerts)
- Download activity reports, feedback logs, and swap statistics

---

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript, Bootstrap  
- **Backend:** Python, Flask  
- **Database:** Firebase Firestore or MongoDB  
- **Authentication:** Firebase Authentication  
- **File Storage:** Firebase Storage (for profile images)  
- **Session Management:** Flask-Session  

---

## � Project Structure

```
skillswap/
├── app/
│   ├── __init__.py                 # Flask app initialization
│   ├── routes.py                   # All API endpoints and routes
│   ├── firebase_config.py          # Firebase configuration
│   ├── serviceAccountKey.json      # Firebase credentials (gitignored)
│   ├── static/
│   │   ├── css/                    # Stylesheets for each page
│   │   ├── data/                   # JSON data (degrees, titles, etc.)
│   │   └── js/                     # Frontend JavaScript logic
│   └── templates/                  # HTML templates
├── run.py                          # Application entry point
├── requirements.txt                # Python dependencies
├── Procfile                        # Heroku/Vercel deployment config
├── vercel.json                     # Vercel-specific configuration
├── runtime.txt                     # Python version specification
└── README.md                       # This file
```

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Firebase account with Firestore database
- Git (for cloning the repository)

### Step 1: Clone the Repository

```bash
git clone https://github.com/NikhilShimpy/SwapSkills.git
cd skillswap
```

### Step 2: Set Up Python Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Download your service account key JSON file
3. Add the `serviceAccountKey.json` file to the `app/` directory
4. Update `app/firebase_config.py` with your Firebase configuration

### Step 5: Environment Variables (Optional)

Create a `.env` file in the project root (if needed):

```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
```

---

## 🚀 Running the Application

```bash
python run.py
```

The application will be available at `http://localhost:5000`

### Running with Flask CLI

```bash
export FLASK_APP=run.py
flask run
```

---

## 🔌 API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /signin` - Login user
- `GET /logout` - Logout user

### User Profile
- `GET /profile` - Get current user profile
- `POST /profile/update` - Update user profile
- `GET /user/<user_id>` - Get specific user profile

### Skills
- `GET /skills` - Browse all available skills
- `GET /skills/search` - Search skills by keyword
- `POST /skills/add` - Add a new skill

### Swap Requests
- `POST /swap/request` - Create a new swap request
- `GET /swap/requests` - Get all swap requests for user
- `POST /swap/accept/<request_id>` - Accept a swap request
- `POST /swap/reject/<request_id>` - Reject a swap request
- `POST /swap/complete/<request_id>` - Mark swap as completed

### Feedback & Ratings
- `POST /feedback/submit` - Submit feedback after swap
- `GET /feedback/<user_id>` - Get user ratings and feedback

### Messaging
- `GET /messages` - Get all conversations
- `POST /messages/send` - Send a message
- `GET /messages/<user_id>` - Get conversation with specific user

---

## 🐛 Troubleshooting

### Issue: Firebase Connection Error
**Solution:** Ensure `serviceAccountKey.json` is placed in the `app/` directory and contains valid Firebase credentials.

### Issue: Port 5000 Already in Use
**Solution:** Run on a different port:
```bash
python run.py --port 5001
```

### Issue: Dependencies Installation Fails
**Solution:** Upgrade pip and try again:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: Static Files Not Loading
**Solution:** Ensure you're running from the project root directory where `app/` folder exists.

---

## 📝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Style
- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Author & Contributors

**Lead Developer:** Nikhil Shimpy  
- 💼 [LinkedIn](https://www.linkedin.com/in/nikhilshimpy/)  
- 🐙 [GitHub](https://github.com/NikhilShimpy)  
- 📸 [Instagram](https://www.instagram.com/nikhilshimpyy/?hl=en)
- 🔗 [LinkTree](https://linktr.ee/nikhilshimpyy)
- 🖥️ [Portfolio](https://nikhilshimpyyportfolio.vercel.app/)

**Team Contributors:**
- Harsh Vardhan
- Palak Paithari
- Chetna Sikarwar

---

## 📚 Useful Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Bootstrap](https://getbootstrap.com/)
- [GitHub Repository](https://github.com/NikhilShimpy/SwapSkills)

---

**Made with ❤️ by the Skill Swap Team**
