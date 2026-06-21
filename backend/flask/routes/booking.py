from flask import Blueprint, request, jsonify
from database import db
from models.booking import Booking
from models.user import Owner, Petsitter
from models.pets import Pet
from datetime import datetime

<<<<<<< HEAD
bookings_bp = Blueprint('bookings_bp', __name__,)
=======
bookings_bp = Blueprint('bookings_bp', __name__)
>>>>>>> 53bf570844ad0747945c035df70593904104f25f

# ==========================================
# CREAR NUEVA RESERVA
# ==========================================
@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    data = request.json
    owner_id = data.get('owner_id')
    petsitter_id = data.get('petsitter_id')
    pet_id = data.get('pet_id')
    service_type = data.get('service_type') 
    start_date = data.get('start_date')     
    end_date = data.get('end_date')  

    start_time = data.get('start_time')
    end_time = data.get('end_time')
    comments = data.get('comments')

    if not all([owner_id, petsitter_id, pet_id, service_type, start_date, end_date]):
         return jsonify({"msg": "Faltan campos requeridos para la reserva"}), 400

    owner = db.session.get(Owner, owner_id)
    petsitter = db.session.get(Petsitter, petsitter_id)
    pet = db.session.get(Pet, pet_id)

    if not owner or not petsitter or not pet:
        return jsonify({"msg": "Dueño, cuidador o mascota no válidos"}), 404

    if pet.owner_id != owner.id:
        return jsonify({"msg": "La mascota seleccionada no pertenece al dueño"}), 403

    total_price = 0.0
    
    try:
        # REFACTORIZACIÓN:  (días y horas)
        d1 = datetime.strptime(start_date, "%Y-%m-%d") .date()
        d2 = datetime.strptime(end_date, "%Y-%m-%d") .date()
        days = (d2 - d1).days

        if days < 0:
            return jsonify({"msg": "La fecha de fin no puede ser anterior a la de inicio"}), 400
        if days == 0:
            days = 1 

        t1_obj = datetime.strptime(start_time, "%H:%M").time() if start_time else None
        t2_obj = datetime.strptime(end_time, "%H:%M").time() if end_time else None
            
        # Calcular horas si se proporcionaron  
        hours = 0.0
        if t1_obj and t2_obj:
            dt1 = datetime.combine(d1, t1_obj)
            dt2 = datetime.combine(d1, t2_obj)
            hours = (dt2 - dt1).total_seconds() / 3600.0             
            if hours < 0:
                hours += 24.0  # Cruce de medianoche
            elif hours == 0:
                hours = 1.0
        else:
            hours = 4.0

        if service_type == "hotel":
            if not petsitter.offers_hotel:
                 return jsonify({"msg": "Este cuidador no ofrece servicio de hotel"}), 400
            total_price = days * (petsitter.price_per_night or 0.0)

        elif service_type == "nightcare":
            if not petsitter.offers_nightcare:
                 return jsonify({"msg": "Este cuidador no ofrece servicio de cuidado nocturno"}), 400
            total_price = days * (petsitter.price_per_night or 0.0)

        elif service_type == "paseo":
            if not petsitter.offers_walk:
                 return jsonify({"msg": "Este cuidador no ofrece servicio de paseo"}), 400
            
            total_price = days * hours * (petsitter.price_per_hour or 0.0)

        elif service_type == "guarderia":
            if not petsitter.offers_daycare:
                  return jsonify({"msg": "Este cuidador no ofrece servicio de guardería"}), 400
            
            total_price = days * hours * (petsitter.price_per_hour or 0.0)
        else:
            return jsonify({"msg": "Tipo de servicio no válido"}), 400

    except ValueError:
        return jsonify({"msg": "Formato de fechas u horas inválido"}), 400

    # Crear la Reserva
    new_booking = Booking(
        owner_id=owner.id,
        petsitter_id=petsitter.id,
        pet_id=pet.id,
        service_type=service_type,
        start_date=d1,
        end_date=d2,
        start_time=t1_obj,
        end_time=t2_obj,
        total_price=total_price,
        comments=comments,
        status="pending"
    )

    db.session.add(new_booking)
    db.session.commit()

    return jsonify({
        "msg": "Reserva creada exitosamente",
        "booking": new_booking.serialize()
    }), 201

# ==========================================
# CAMBIAR ESTADO DE LA RESERVA
# ==========================================
@bookings_bp.route('/bookings/<int:booking_id>/status', methods=['PATCH'])
def update_booking_status(booking_id):
    data = request.json
    new_status = data.get('status')

    if not new_status:
        return jsonify({"msg": "Falta el nuevo estado"}), 400

    booking = db.session.get(Booking, booking_id)
    if not booking:
        return jsonify({"msg": "Reserva no encontrada"}), 404

    if new_status not in ["aceptado", "rechazado", "completado", "cancelado"]:
        return jsonify({"msg": "Estado de reserva inválido"}), 400

    booking.status = new_status

    if new_status == "completado":
        petsitter = booking.petsitter
        if petsitter:
            petsitter.booking_count += 1

    db.session.commit()
    return jsonify({
        "msg": f"El estado de la reserva ha cambiado a: {new_status}",
        "booking": booking.serialize()
    }), 200

# ==========================================
# VER RESERVAS DE UN DUEÑO O CUIDADOR
# ==========================================
@bookings_bp.route('/bookings/user/<string:role>/<int:profile_id>', methods=['GET'])
def get_user_bookings(role, profile_id):
    if role == 'owner':
        bookings = db.session.execute(db.select(Booking).filter_by(owner_id=profile_id)).scalars().all()
    elif role == 'petsitter':
        bookings = db.session.execute(db.select(Booking).filter_by(petsitter_id=profile_id)).scalars().all()
    else:
        return jsonify({"msg": "Rol no válido para consultar reservas"}), 400

    return jsonify([booking.serialize() for booking in bookings]), 200