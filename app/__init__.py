import os
from flask import Flask
from flask_socketio import SocketIO
from .routes import main

# Firebase config
from .firebase_config import db, bucket

# Initialize SocketIO WITHOUT passing the app yet
# async_mode='threading' avoids eventlet issues
socketio = SocketIO(async_mode='threading', cors_allowed_origins="*")

def create_app():
    app = Flask(__name__)

    # Secret key
    app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-for-local")

    # Register blueprints
    app.register_blueprint(main)

    # Attach SocketIO to this app
    socketio.init_app(app)

    return app
