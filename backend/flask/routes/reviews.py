from flask import Blueprint, request, jsonify
from database import db
from models.reviews import Review

reviews_bp = Blueprint('reviews_bp', __name__)

# ==========================================
# CREAR UNA RESEÑA
# ==========================================
@reviews_bp.route('/reviews', methods=['POST'])
def create_review():
    data = request.json

    booking_id = data.get('booking_id')
    reviewer_id = data.get('reviewer_id')
    reviewed_id = data.get('reviewed_id')
    rating = data.get('rating')
    comment = data.get('comment')
    review_type = data.get('review_type')

    if not all([booking_id, reviewer_id, reviewed_id, rating]):
        return jsonify({"msg": "Faltan campos requeridos"}), 400

    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({"msg": "El rating debe ser un número entre 1 y 5"}), 400

    new_review = Review(
        booking_id=booking_id,
        reviewer_id=reviewer_id,
        reviewed_id=reviewed_id,
        rating=rating,
        comment=comment,
        review_type=review_type
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        "msg": "Reseña creada exitosamente",
        "review": new_review.serialize()
    }), 201

# ==========================================
# RESEÑAS DE UN PETSITTER
# ==========================================

@reviews_bp.route('/reviews/petsitter/<int:petsitter_id>', methods= ['GET'])
def  get_petsitter_reviews(petsitter_id):
    reviews = db.session.execute(db.select(Review).filter_by(reviewed_id=petsitter_id)).scalars().all()
    return jsonify([review.serialize() for review in reviews]), 200