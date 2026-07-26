from flask import Blueprint, jsonify, request, current_app
from database import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps

user_bp = Blueprint('user', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({"msg": "Falta el token de autorización"}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['sub'])
            if not current_user:
                return jsonify({"msg": "Usuario no encontrado"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"msg": "El token ha expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"msg": "Token inválido"}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@user_bp.route('/api/user', methods=['GET'])
def get_users():
    return jsonify({"msg": "Todo bien"})

@user_bp.route('/api/user/register', methods=['POST'])
def register_user():
    body = request.get_json()
    username = body.get("username", "").strip()
    email = body.get("email", "").strip()
    password = body.get("password")

    if not email or not password or not username:
        return jsonify({"msg": "Faltan campos"}), 400
            
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "El email ya está registrado"}), 400

    new_user = User(
        username = username,
        email = email,
        password = generate_password_hash(password),
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Registrado con éxito"}), 201

@user_bp.route('/api/user/login', methods=['POST'])
def login_user():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Faltan campos requeridos"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "credenciales invalidas"}), 401

    jwt_token = jwt.encode(
        {
            "sub": user.id,
        },
        current_app.config['SECRET_KEY'],
        algorithm="HS256"
    )
    return jsonify({"msg": "sesión iniciada correctamente", "user": user.serialize(), "token": jwt_token}), 200

@user_bp.route('/api/private', methods=['GET'])
@token_required
def private_route(current_user):
    return jsonify({
        "msg": f"¡Hola {current_user.username}! Estás viendo información protegida.",
        "user": current_user.serialize()
    }), 200