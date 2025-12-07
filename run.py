# run.py
from app import create_app

app = create_app()

# No app.run() here! Vercel handles running the app serverlessly.
