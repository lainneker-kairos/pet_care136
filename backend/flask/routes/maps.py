from flask import Blueprint, request, jsonify
from utils.google_maps import get_distance
from utils.auth import token_required

maps_bp = Blueprint("maps", __name__, url_prefix="/api/maps")

@maps_bp.route("/distance", methods=["POST"])
@token_required
def distance(current_user_id):
    data = request.get_json()
    origin = data.get("address")
    if not origin:
        return jsonify({"error": "Debes enviar una dirección de origen"}), 400

    result = get_distance(origin)
    if not result:
        return jsonify({"error": "No se pudo calcular la distancia"}), 400

    return jsonify(result), 200