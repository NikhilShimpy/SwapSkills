import os
from flask import Flask
from .routes import main

# Import Firebase config to initialize Firebase when app starts
from .firebase_config import db, bucket

def create_app():
    app = Flask(__name__)

    # Use SECRET_KEY from environment variable (secure for Vercel)
    app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-for-local")

    # Register all blueprints
    app.register_blueprint(main)
    return app
