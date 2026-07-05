from flask import Blueprint, jsonify
from database import db
from models.notification import Notification
from utils.auth import token_required

notifications_bp = Blueprint('notifications_bp', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
@token_required
def get_user_notifications(current_user_id):
    # Obtener las notificaciones del usuario ordenadas por fecha (las más recientes primero)
    notifications = db.session.execute(
        db.select(Notification)
        .filter_by(user_id=current_user_id)
        .order_by(Notification.created_at.desc())
    ).scalars().all()
    
    return jsonify([notif.serialize() for notif in notifications]), 200

@notifications_bp.route('/notifications/<int:notif_id>/read', methods=['PATCH'])
@token_required
def mark_as_read(current_user_id, notif_id):
    notification = db.session.get(Notification, notif_id)
    
    if not notification or notification.user_id != current_user_id:
        return jsonify({"msg": "Notificación no encontrada o acceso denegado"}), 404
        
    notification.is_read = True
    db.session.commit()
    
    return jsonify({"msg": "Notificación marcada como leída"}), 200