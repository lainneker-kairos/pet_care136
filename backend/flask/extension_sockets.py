from flask_socketio import SocketIO

# Inicializamos SocketIO permitiendo conexiones desde cualquier origen (CORS)
socketio = SocketIO(cors_allowed_origins="*")

from flask import request

@socketio.on('connect')
def handle_connect():
    print(f"Cliente conectado: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Cliente desconectado: {request.sid}")

@socketio.on('join_notifications')
def on_join_notifications(data):
    """
    El frontend emitirá este evento cuando el usuario inicie sesión.
    Se espera que data contenga {'user_id': ID_DEL_USUARIO}
    """
    from flask_socketio import join_room
    user_id = data.get('user_id')
    if user_id:
        # Creamos una sala única para este usuario
        room = f"user_{user_id}"
        join_room(room)
        print(f"Usuario {user_id} se unió a la sala de notificaciones: {room}")