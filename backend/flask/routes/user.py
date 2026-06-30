from flask import Blueprint, request, jsonify, current_app
from database import db
from models.user import User, Owner, Petsitter
from werkzeug.security import generate_password_hash, check_password_hash
from utils.auth import token_required
import jwt
import datetime

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/user', methods=['GET'])
def get_users():
    return jsonify({"msg": "Todo bien"})

# ==========================================
# REGISTRO DE USUARIOS
# ==========================================
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({"msg": "Faltan datos en la solicitud"}), 400

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"msg": "Todos los campos obligatorios (email, password, role, name) son requeridos"}), 400

    user_exists = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if user_exists:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        role='owner', # Por defecto, el usuario se registra como propietario
        is_active=True
    )
    db.session.add(new_user)
    db.session.flush()

    # ==========================================
    # ACTUALIZACIÓN DEL PERFIL DUEÑO (Owner)
    # ==========================================

    new_profile = Owner(
        user_id=new_user.id,
        name=name,        
    )

    db.session.add(new_profile)
    db.session.commit()

    return jsonify({
        "msg": "Usuario y perfil creados exitosamente",
        "user": new_user.serialize()
    }), 201

# ==========================================
# INICIO DE SESIÓN
# ==========================================
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Faltan credenciales"}), 400

    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Correo o contraseña incorrectos"}), 401

    if not user.is_active:
        return jsonify({"msg": "Cuenta de usuario desactivada"}), 403

    expiration_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    jwt_token = jwt.encode(
        {
            "sub": str(user.id),  
            "exp": expiration_time
        },
        current_app.config['SECRET_KEY'],  
        algorithm="HS256"
    )
    
    return jsonify({
        "msg": "Sesión iniciada correctamente",
        "user": user.serialize(),
        "token": jwt_token
    }), 200

# ==========================================
# OBTENER PERFIL PROPIO 
# ==========================================
@user_bp.route('/profile/me', methods=['GET'])
@token_required
def get_my_profile(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    return jsonify({
        "user": user.serialize(),
        "owner_profile": user.owner_profile.serialize() if user.owner_profile else None,
        "petsitter_profile": user.petsitter_profile.serialize() if user.petsitter_profile else None
    }), 200

# ==========================================
# ACTUALIZACIÓN PERFIL DUEÑO (PATCH)
# ==========================================
@user_bp.route('/profile/owner', methods=['PATCH'])
@token_required
def update_owner_profile(current_user_id):
    data = request.json
    user = db.session.get(User, current_user_id)
    
    if not user or not user.owner_profile:
        return jsonify({"msg": "Perfil de dueño no encontrado"}), 404

    profile = user.owner_profile
    
    #  Lista de los campos permitidos para actualizar dinámicamente
    allowed_fields = ['name', 'phone', 'city', 'neighborhood', 'bio', 'profile_pic', 'max_budget']
    
    for key, value in data.items():
        if key in allowed_fields:
            setattr(profile, key, value) # para actualizar dinámicamente solo lo que se envió

    db.session.commit()
    return jsonify({
        "msg": "Perfil de dueño actualizado exitosamente",
        "owner_profile": profile.serialize()
    }), 200

# ==========================================
# CONVERTIRSE EN CUIDADOR (crear perfil de Petsitter)
# ==========================================
@user_bp.route('/profile/petsitter', methods=['POST'])
@token_required
def bepetsitter(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if user.petsitter_profile:
        return jsonify({"msg": "Este usuario ya tiene un perfil de cuidador"}), 400
    
    data = request.json or {}
    
    name = data.get('name') or (user.owner_profile.name if user.owner_profile else "Cuidador")
    phone = data.get('phone') or (user.owner_profile.phone if user.owner_profile else "")
    city = data.get('city') or (user.owner_profile.city if user.owner_profile else "")

    # Actualizar el rol del usuario
    user.role = 'petsitter'  # Ahora el usuario puede ser dueño y cuidador

    # Crear el nuevo perfil de cuidador
    new_profile = Petsitter(
        user_id=user.id,
        name=name,
        phone=phone,
        city=city,
        neighborhood=data.get('neighborhood', ""),
        bio=data.get('bio', ""),
        profile_pic=data.get('profile_pic', ""),
        experience_years=data.get('experience_years', 0),
        price_per_hour=data.get('price_per_hour', 0.0),
        price_per_night=data.get('price_per_night', 0.0)
    )
    db.session.add(new_profile)
    db.session.commit()

    return jsonify({
        "msg": "¡Felicidades! Ahora tienes un perfil de cuidador.",
        "petsitter_profile": new_profile.serialize()
    }), 201

# ==========================================
# ACTUALIZACIÓN PARCIAL: PERFIL CUIDADOR (PATCH)
# ==========================================
@user_bp.route('/profile/petsitter', methods=['PATCH'])
@token_required
def update_petsitter_profile(current_user_id):
    data = request.json
    user = db.session.get(User, current_user_id)
    
    if not user or not user.petsitter_profile:
        return jsonify({"msg": "Perfil de cuidador no encontrado. Regístrate como cuidador primero."}), 404

    profile = user.petsitter_profile
    
    # Campos permitidos para Petsitter
    allowed_fields = [
        'name', 'phone', 'city', 'neighborhood', 'bio', 'profile_pic', 
        'experience_years', 'certifications', 'available_days', 'accepted_dog_sizes',
        'offers_walk', 'offers_hotel', 'offers_daycare', 'offers_nightcare',
        'price_per_hour', 'price_per_night', 'google_calendar_id'
    ]
    
    for key, value in data.items():
        if key in allowed_fields:
            setattr(profile, key, value) # setattr asigna el valor dinámicamente

    db.session.commit()
    return jsonify({
        "msg": "Perfil de cuidador actualizado exitosamente",
        "petsitter_profile": profile.serialize()
    }), 200


# ==========================================
# OBTENER PERFIL DE OTRO USUARIO (Público)
# ==========================================
@user_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_public_profile(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    profile_data = user.petsitter_profile.serialize() if user.petsitter_profile else (user.owner_profile.serialize() if user.owner_profile else None)

    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "profile": profile_data
    }), 200