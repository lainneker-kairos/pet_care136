from flask import Blueprint, jsonify, request
from database import db
from models.pets import Pet
from utils.auth import token_required

pets_bp = Blueprint('pets', __name__)

# OBTENER LAS MASCOTAS DEL USUARIO AUTENTICADO
@pets_bp.route('/api/pets', methods=['GET'])
@token_required
def get_my_pets(current_user):
    # current_user viene del decorador @token_required
    pets = Pet.query.filter_by(owner_id=current_user.id).all()
    return jsonify([pet.serialize() for pet in pets]), 200

# REGISTRAR UNA NUEVA MASCOTA
@pets_bp.route('/api/pets', methods=['POST'])
@token_required
def create_pet(current_user):
    body = request.get_json()
    
    name = body.get("name")
    species = body.get("species")
    
    if not name or not species:
        return jsonify({"msg": "Faltan datos de la mascota (nombre, especie)"}), 400

    new_pet = Pet(
        name=name,
        species=species,
        breed=body.get("breed", ""),
        age=body.get("age"),
        description=body.get("description", ""),
        owner_id=current_user.id # Se asigna automáticamente al usuario logueado
    )

    db.session.add(new_pet)
    db.session.commit()

    return jsonify({"msg": "Mascota creada con éxito", "pet": new_pet.serialize()}), 201