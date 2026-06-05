from flask import Blueprint, jsonify, request, current_app
from database import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user', methods=['GET'])
def get_users():
    return jsonify({"msg": "Todo bien"})

@user_bp.route('/api/user/register', methods=['POST'])
def register_user():

    body = request.get_json ()
    username = body.get ("username", "").strip()
    email = body.get ("email", "").strip()
    password = body.get ("password")
    role_temp = body.get("role")
    role = role_temp.strip() if role_temp else "user"

    roles_permitidos = ["owner", "petsitter",]

    if role not in roles_permitidos:
        return jsonify({"msg": "Rol no válido"}), 400

    if not email or not password or not username:
        return jsonify({"msg": "Faltan campos"}), 400
           
    new_user = User (
        username = username,
        email = email,
        password = generate_password_hash(password),
        role = role
    )

    db.session.add(new_user)
    db.session.commit()

    return (
        jsonify({"msg": "Registrado con éxito"}),
        201
    )

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

#generar token de autenticación

    jwt_token = jwt.encode(
        {
            "sub": user.id,
        },
        current_app.config['SECRET_KEY'],
        algorithm="HS256"
    )
    return (
       jsonify({"msg": "sesión iniciada correctamente", "user": user.serialize(), "token": jwt_token})
    )