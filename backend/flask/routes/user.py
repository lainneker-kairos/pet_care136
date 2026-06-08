from flask import Blueprint, request, jsonify, current_app
from database import db
from models.user import User, Owner, Petsitter
from werkzeug.security import generate_password_hash, check_password_hash
from utils.auth import token_required
import jwt
import datetime

user_bp = Blueprint('user_bp', __name__, url_prefix='/api')

# ==========================================
# 1ra RUTA DE PRUEBA (clase horacio)
# ==========================================
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
    role = data.get('role') # "owner" o "petsitter"
    name = data.get('name')

    if not email or not password or not role or not name:
        return jsonify({"msg": "Todos los campos obligatorios (email, password, role, name) son requeridos"}), 400

    if role not in ['owner', 'petsitter']:
        return jsonify({"msg": "Rol inválido. 'Debes elegir un rol'"}), 400

    # Verificar si el usuario ya existe
    user_exists = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if user_exists:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    # Crear el usuario base usando los campos exactos del modelo 
    hashed_password = generate_password_hash(password)

    new_user = User(
        email=email,
        password=hashed_password,
        role=role,
        is_active=True
    )
    db.session.add(new_user)
    db.session.flush() # Obtiene el new_user.id antes de hacer el commit

    # Creación del perfil correspondiente según el rol
    if role == 'owner':
        new_profile = Owner(
        user_id=new_user.id,
        name=name,
        phone=data.get('phone'),
        city=data.get('city'),
        neighborhood=data.get('neighborhood'),
        bio=data.get('bio', ""),
        profile_pic=data.get('profile_pic', ""),
        max_budget=data.get('max_budget')
        )
    else:
        new_profile = Petsitter(
        user_id=new_user.id,
        name=name,
        phone=data.get('phone'),
        city=data.get('city'),
        neighborhood=data.get('neighborhood'),
        bio=data.get('bio', ""),
        profile_pic=data.get('profile_pic', ""),
        experience_years=data.get('experience_years', 0),
        certifications=data.get('certifications', ""),
        price_per_hour=data.get('price_per_hour', 0.0),
        price_per_night=data.get('price_per_night', 0.0)
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

    # Obtener información básica de perfil para el frontend
    profile_id = None
    profile_name = ""
    if user.role == 'owner' and user.owner_profile:
        profile_id = user.owner_profile.id
        profile_name = user.owner_profile.name
    elif user.role == 'petsitter' and user.petsitter_profile:
        profile_id = user.petsitter_profile.id
        profile_name = user.petsitter_profile.name

    # Generación de token JWT con expiración de 24 horas (idéntico a tu lógica original)
    expiration_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    jwt_token = jwt.encode(
        {
            "sub": user.id,  
            "exp": expiration_time
        },
        current_app.config['SECRET_KEY'],  
        algorithm="HS256"
    )
    
    return jsonify({
        "msg": "Sesión iniciada correctamente",
        "user": user.serialize(),
        "profile": {
            "profile_id": profile_id,
            "name": profile_name
        },
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

    # Serializar el perfil completo basado en el rol del usuario
    profile_data = None
    if user.role == 'owner' and user.owner_profile:
        profile_data = user.owner_profile.serialize()
    elif user.role == 'petsitter' and user.petsitter_profile:
        profile_data = user.petsitter_profile.serialize()

    return jsonify({
        "user": user.serialize(),
        "profile": profile_data
    }), 200


# ==========================================
# OBTENER PERFIL DE OTRO USUARIO (Público)
# ==========================================
@user_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_public_profile(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    profile_data = None
    if user.role == 'owner' and user.owner_profile:
        profile_data = user.owner_profile.serialize()
    elif user.role == 'petsitter' and user.petsitter_profile:
        profile_data = user.petsitter_profile.serialize()

    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "profile": profile_data
    }), 200


# ==========================================
# ACTUALIZACIÓN DE PERFIL PROPIO 
# ==========================================
@user_bp.route('/profile/update', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    data = request.json
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    profile = None
    if user.role == 'owner':
        profile = user.owner_profile
        if not profile:
            return jsonify({"msg": "Perfil de dueño no encontrado"}), 404
        
        # Actualización de campos permitidos para Owner
        profile.name = data.get('name', profile.name)
        profile.phone = data.get('phone', profile.phone)
        profile.city = data.get('city', profile.city)
        profile.neighborhood = data.get('neighborhood', profile.neighborhood)
        profile.bio = data.get('bio', profile.bio)
        profile.profile_pic = data.get('profile_pic', profile.profile_pic)
        profile.max_budget = data.get('max_budget', profile.max_budget)

    elif user.role == 'petsitter':
        profile = user.petsitter_profile
        if not profile:
            return jsonify({"msg": "Perfil de cuidador no encontrado"}), 404
        
        # Actualización de campos permitidos para Petsitter
        profile.name = data.get('name', profile.name)
        profile.phone = data.get('phone', profile.phone)
        profile.city = data.get('city', profile.city)
        profile.neighborhood = data.get('neighborhood', profile.neighborhood)
        profile.bio = data.get('bio', profile.bio)
        profile.profile_pic = data.get('profile_pic', profile.profile_pic)
        profile.experience_years = data.get('experience_years', profile.experience_years)
        profile.certifications = data.get('certifications', profile.certifications)
        profile.available_days = data.get('available_days', profile.available_days)
        profile.accepted_dog_sizes = data.get('accepted_dog_sizes', profile.accepted_dog_sizes)
        
        # Servicios (booleanos)
        profile.offers_walk = data.get('offers_walk', profile.offers_walk)
        profile.offers_hotel = data.get('offers_hotel', profile.offers_hotel)
        profile.offers_daycare = data.get('offers_daycare', profile.offers_daycare)
        profile.offers_nightcare = data.get('offers_nightcare', profile.offers_nightcare)
        
        # Precios
        profile.price_per_hour = data.get('price_per_hour', profile.price_per_hour)
        profile.price_per_night = data.get('price_per_night', profile.price_per_night)
        profile.google_calendar_id = data.get('google_calendar_id', profile.google_calendar_id)

    db.session.commit()
    return jsonify({
        "msg": "Perfil actualizado exitosamente",
        "profile": profile.serialize()
    }), 200