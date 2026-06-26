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


# ==========================================
# REGISTRAR UNA NUEVA MASCOTA
# ==========================================
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

# ==========================================
# ACTUALIZAR UNA MASCOTA (PATCH)
# ==========================================
@pets_bp.route('/pets/<int:pet_id>', methods=['PATCH'])
@token_required
def update_pet(current_user_id, pet_id):
    user = db.session.get(User, current_user_id)
    
    if not user or not user.owner_profile:
        return jsonify({"msg": "Solo los dueños pueden editar mascotas."}), 403

    # Buscar la mascota en la base de datos
    pet = db.session.get(Pet, pet_id)
    if not pet:
        return jsonify({"msg": "Mascota no encontrada."}), 404

    # Verificar que el usuario sea el dueño de esta mascota específica
    if pet.owner_id != user.owner_profile.id:
        return jsonify({"msg": "No tienes permiso para editar esta mascota."}), 403

    body = request.get_json()
    
    # Campos permitidos para actualizar
    allowed_fields = [
        'name', 'species', 'breed', 'age', 'size', 'tags', 
        'behavior', 'allergies', 'medications', 'special_notes', 'photo'
    ]
    
    # Actualización dinámica
    for key, value in body.items():
        if key in allowed_fields:
            setattr(pet, key, value)

    db.session.commit()

    return jsonify({
        "msg": "Mascota actualizada con éxito", 
        "pet": pet.serialize()
    }), 200

# ==========================================
# ELIMINAR UNA MASCOTA (DELETE)
# ==========================================
@pets_bp.route('/pets/<int:pet_id>', methods=['DELETE'])
@token_required
def delete_pet(current_user_id, pet_id):
    user = db.session.get(User, current_user_id)
    
    if not user or not user.owner_profile:
        return jsonify({"msg": "Solo los dueños pueden eliminar mascotas."}), 403

    # Buscar la mascota
    pet = db.session.get(Pet, pet_id)
    if not pet:
        return jsonify({"msg": "Mascota no encontrada."}), 404

    # Autorización
    if pet.owner_id != user.owner_profile.id:
        return jsonify({"msg": "No tienes permiso para eliminar esta mascota."}), 403

    db.session.delete(pet)
    db.session.commit()

    return jsonify({"msg": "Mascota eliminada con éxito."}), 200