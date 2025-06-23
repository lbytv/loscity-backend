from flask import Blueprint
application_bp = Blueprint('application', __name__)

@application_bp.route("/application/ping")
def ping():
    return {"message": "application ok"}
