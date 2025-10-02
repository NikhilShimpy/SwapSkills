from flask import Flask
from .routes import main

def create_app():
    app = Flask(__name__)
    app.secret_key = '19162b2a91226477745d08b3b7d7224d0ca2e0531455bbe92d61ec83ebe371f8'
    app.register_blueprint(main)
    return app
