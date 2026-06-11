from flask import Blueprint, jsonify, request
from database import db
from models.pets import Pet
from models.user import User
from utils.auth import token_required

pets_bp = Blueprint('pets_bp', __name__)

# OBTENER LAS MASCOTAS DEL USUARIO AUTENTICADO
@pets_bp.route('/pets', methods=['GET'])
@token_required
def get_my_pets(current_user_id):
    #  Buscamos al usuario base
    user = db.session.get(User, current_user_id)
    
    # Verificamos que tenga un perfil de dueño (Owner)
    if not user or not user.owner_profile:
        return jsonify({"msg": "No se encontró un perfil de dueño para este usuario"}), 404
    
    # cambiamos .query.filter_by por db.select para evitar problemas de sesión
    pets = db.session.execute(
        db.select(Pet).filter_by(owner_id=user.owner_profile.id)
    ).scalars().all()
    
    return jsonify([pet.serialize() for pet in pets]), 200


# REGISTRAR UNA NUEVA MASCOTA
@pets_bp.route('/pets', methods=['POST'])
@token_required
def create_pet(current_user_id):
    #agregamos validación para asegurarnos de que el usuario tenga un perfil de dueño antes de crear la mascota
    user = db.session.get(User, current_user_id)
    print(user, user.owner_profile)  # Debug: Verificar el usuario y su perfil de dueño
    if not user or not user.owner_profile:
        return jsonify({"msg": "solo los dueños pueden registrar mascotas"}), 404

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
        size=body.get("size", ""),
        tags=body.get("tags", ""),
        behavior=body.get("behavior", ""),
        allergies=body.get("allergies", ""),
        medications=body.get("medications", ""),
        special_notes=body.get("special_notes", ""),
        photo=body.get("photo", ""),
        owner_id=user.owner_profile.id
    )

    db.session.add(new_pet)
    db.session.commit()

    return jsonify({"msg": "Mascota creada con éxito", "pet": new_pet.serialize()}), 201