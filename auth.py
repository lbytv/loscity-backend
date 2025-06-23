from flask import Blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/auth/ping")
def ping():
    return {"message": "auth ok"}
