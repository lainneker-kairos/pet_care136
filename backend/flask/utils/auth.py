from functools import wraps
from flask import request, jsonify, current_app
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # 1. Verificar si el encabezado de autorización está presente
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            
            # El formato debe ser "Bearer <token>"
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"msg": "El formato del token debe ser 'Bearer <token>'"}), 401

        # Si no hay token
        if not token:
            return jsonify({"msg": "Token ausente, autorización denegada"}), 401

        # 2. Decodificar el token con el current_app
        try:
            # Obtenemos la clave secreta directamente de la configuración de la app
            secret_key = current_app.config['SECRET_KEY']
            
            data = jwt.decode(token, secret_key, algorithms=["HS256"])
            
            # Buscamos 'sub' que es donde guardamos el ID del usuario al generar el token
            current_user_id = data.get("sub")
            
        except jwt.ExpiredSignatureError:
            return jsonify({"msg": "la sesion ha expirado, inicia sesión nuevamente"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"msg": "clave incorrecta"}), 401

        # Pasamos el ID del usuario a la ruta protegida
        return f(current_user_id, *args, **kwargs)

    return decorated