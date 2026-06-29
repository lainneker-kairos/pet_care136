import os
from flask import Blueprint, redirect, request, jsonify
from utils.google_calendar import get_google_flow
from utils.auth import token_required
from models.user import User
from database import db

calendar_bp = Blueprint("calendar", __name__, url_prefix="/api/calendar")

@calendar_bp.route("/auth", methods=["GET"])
@token_required
def google_auth(current_user_id):
    flow = get_google_flow()
    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
        state=str(current_user_id),
    )
    return jsonify({"auth_url": auth_url})

@calendar_bp.route("/oauth2callback", methods=["GET"])
def oauth2callback():
    state = request.args.get("state")
    flow = get_google_flow()
    flow.fetch_token(authorization_response=request.url)
    creds = flow.credentials

    user = db.session.get(User, int(state))
    if not user:
        return redirect(f"{os.getenv('FRONTEND_URL')}/calendar/error")

    user.google_access_token = creds.token
    user.google_refresh_token = creds.refresh_token or user.google_refresh_token
    db.session.commit()
    return redirect(f"{os.getenv('FRONTEND_URL')}/calendar/success")