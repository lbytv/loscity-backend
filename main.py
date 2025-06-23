import os
from flask import Flask, session
from flask_cors import CORS
from user import db
from auth import auth_bp
from application import application_bp
from discord import discord_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///test.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    CORS(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(application_bp)
    app.register_blueprint(discord_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
