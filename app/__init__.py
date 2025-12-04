# __init__.py
import os
from flask import Flask
from .routes import main
from .firebase_config import db, bucket

def create_app():
    app = Flask(__name__)
    
    # Use SECRET_KEY from environment or fallback (for local dev)
    app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-for-local")
    
    # Register your routes blueprint
    app.register_blueprint(main)
    
    return app
