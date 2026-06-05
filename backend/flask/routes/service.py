from flask import Blueprint, jsonify, request
from database import db
from models.service import Service, Availability
from utils.auth import token_required

services_bp = Blueprint('services', __name__)

# --- SERVICIOS ---
@services_bp.route('/api/services', methods=['POST'])
@token_required
def create_service(current_user):
    if current_user.role != 'petsitter':
        return jsonify({"msg": "Solo los petsitters pueden crear servicios"}), 403
    
    body = request.get_json()
    new_service = Service(
        name=body.get("name"),
        description=body.get("description"),
        price=body.get("price"),
        petsitter_id=current_user.id
    )
    db.session.add(new_service)
    db.session.commit()
    return jsonify({"msg": "Servicio creado"}), 201

# --- DISPONIBILIDAD ---
@services_bp.route('/api/availability', methods=['POST'])
@token_required
def set_availability(current_user):
    if current_user.role != 'petsitter':
        return jsonify({"msg": "Solo los petsitters pueden gestionar disponibilidad"}), 403
    
    body = request.get_json()
    new_avail = Availability(
        date=body.get("date"),
        start_time=body.get("start_time"),
        end_time=body.get("end_time"),
        petsitter_id=current_user.id
    )
    db.session.add(new_avail)
    db.session.commit()
    return jsonify({"msg": "Disponibilidad guardada"}), 201