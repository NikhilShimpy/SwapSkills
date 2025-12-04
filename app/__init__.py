import os
from flask import Flask
from flask_socketio import SocketIO
from .routes import main
from .firebase_config import db, bucket

# socketio = SocketIO(cors_allowed_origins="*", async_mode="threading")
socketio = SocketIO(cors_allowed_origins="*", async_mode="eventlet")

def create_app():
    app = Flask(__name__)
    app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-for-local")

    # Register Blueprints
    app.register_blueprint(main)

    # Initialize SocketIO
    socketio.init_app(app)

    return app, socketio   # ← IMPORTANT FIX
