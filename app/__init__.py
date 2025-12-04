# __init__.py
from flask import Flask
from .routes import main
from .firebase_config import db, bucket

def create_app():
    app = Flask(__name__)
    app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-for-local")
    app.register_blueprint(main)
    return app
