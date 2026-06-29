import os
import requests

def get_distance(origin, destination=None):
    destination = destination or os.getenv("BUSINESS_ADDRESS")
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": origin,
        "destinations": destination,
        "key": os.getenv("GOOGLE_MAPS_API_KEY"),
        "language": "es",
        "units": "metric",
    }
    response = requests.get(url, params=params).json()
    
    try:
        element = response["rows"][0]["elements"][0]
        if element["status"] != "OK":
            return None
        return {
            "distance_text": element["distance"]["text"],
            "duration_text": element["duration"]["text"],
        }
    except (KeyError, IndexError):
        return None