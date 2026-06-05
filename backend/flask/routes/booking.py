from flask import Blueprint, jsonify, request
from database import db
from models.booking import Booking, Review
from utils.auth import token_required

bookings_bp = Blueprint('bookings', __name__)

# --- RESERVAS ---
@bookings_bp.route('/api/bookings', methods=['POST'])
@token_required
def create_booking(current_user):
    body = request.get_json()
    # Aquí deberías validar que la fecha esté disponible
    new_booking = Booking(
        start_date=body.get("start_date"),
        end_date=body.get("end_date"),
        total_price=body.get("total_price"),
        owner_id=current_user.id,
        petsitter_id=body.get("petsitter_id"),
        pet_id=body.get("pet_id"),
        service_id=body.get("service_id")
    )
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({"msg": "Reserva creada"}), 201

# --- VALORACIONES ---
@bookings_bp.route('/api/reviews', methods=['POST'])
@token_required
def create_review(current_user):
    body = request.get_json()
    new_review = Review(
        rating=body.get("rating"),
        comment=body.get("comment"),
        reviewer_id=current_user.id,
        petsitter_id=body.get("petsitter_id")
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify({"msg": "Valoración enviada"}), 201