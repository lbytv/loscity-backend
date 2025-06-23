from flask import Blueprint
discord_bp = Blueprint('discord', __name__)

@discord_bp.route("/discord/ping")
def ping():
    return {"message": "discord ok"}
