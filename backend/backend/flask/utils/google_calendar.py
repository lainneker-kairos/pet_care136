import os
from datetime import timedelta
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request as GoogleRequest
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/calendar.events"]

def get_google_flow():
    return Flow.from_client_config(
        {
            "web": {
                "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [os.getenv("GOOGLE_REDIRECT_URI")],
            }
        },
        scopes=SCOPES,
        redirect_uri=os.getenv("GOOGLE_REDIRECT_URI"),
    )

def credentials_from_user(user):
    if not user.google_refresh_token:
        return None
    creds = Credentials(
        token=user.google_access_token,
        refresh_token=user.google_refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        scopes=SCOPES,
    )
    if creds.expired:
        creds.refresh(GoogleRequest())
        user.google_access_token = creds.token
        from database import db
        db.session.commit()
    return creds

def create_calendar_event(user, booking):
    creds = credentials_from_user(user)
    if not creds:
        return None
    service = build("calendar", "v3", credentials=creds)
    start_dt = booking.start_date
    end_dt = booking.end_date or (start_dt + timedelta(days=1))
    event = {
        "summary": f"Cita Pet Care - {booking.service_type}",
        "description": f"Reserva en Pet Care (id: {booking.id})",
        "start": {"date": str(start_dt)},
        "end": {"date": str(end_dt)},
    }
    created = service.events().insert(calendarId="primary", body=event).execute()
    return created.get("id")