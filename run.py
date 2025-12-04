# run.py
from app import create_app

# Create the Flask app instance
app = create_app()

# No app.run() here! Vercel handles running the app serverlessly.
