from flask import Blueprint, request, jsonify
from database import db
from models.booking import Booking
from models.user import Owner, Petsitter
from models.pets import Pet
from datetime import datetime

bookings_bp = Blueprint('bookings_bp', __name__, url_prefix='/api')

# ==========================================
# CREAR NUEVA RESERVA
# ==========================================
@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    data = request.json
    owner_id = data.get('owner_id')
    petsitter_id = data.get('petsitter_id')
    pet_id = data.get('pet_id')
    service_type = data.get('service_type') # "paseo", "hotel", "guarderia", "paseo nocturno"
    start_date = data.get('start_date')     # Formato "YYYY-MM-DD"
    end_date = data.get('end_date')         # Formato "YYYY-MM-DD"
    
    # Horas opcionales (principalmente paseos)
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    comments = data.get('comments')

    # Validaciones iniciales
    if not all([owner_id, petsitter_id, pet_id, service_type, start_date, end_date]):
        return jsonify({"msg": "Faltan campos requeridos para la reserva"}), 400

    owner = db.session.get(Owner, owner_id)
    petsitter = db.session.get(Petsitter, petsitter_id)
    pet = db.session.get(Pet, pet_id)

    if not owner or not petsitter or not pet:
        return jsonify({"msg": "Dueño, cuidador o mascota no válidos"}), 404

    # Verificar si la mascota pertenece al dueño solicitante
    if pet.owner_id != owner.id:
        return jsonify({"msg": "La mascota seleccionada no pertenece al dueño"}), 403

    # Calcular precio de forma dinámica según el tipo de servicio ofrecido por el petsitter
    # Reemplazando el comportamiento de la anterior tabla intermedia de "Service"
    total_price = 0.0
    try:
        # Calcular diferencia en días
        d1 = datetime.strptime(start_date, "%Y-%m-%d")
        d2 = datetime.strptime(end_date, "%Y-%m-%d")
        days = (d2 - d1).days

        if days < 0:
            return jsonify({"msg": "La fecha de fin no puede ser anterior a la de inicio"}), 400
        
        if days <= 0:
            days = 1 # Considerar mínimo 1 día para reservas básicas de horas o paseos individuales
        
        if service_type in ["hotel", "nightcare"]:
            if not petsitter.offers_hotel and not petsitter.offers_nightcare:
                return jsonify({"msg": "Este cuidador no ofrece el servicio seleccionado"}), 400
            total_price = days * (petsitter.price_per_night or 0.0)
        else: # "paseo" o "guarderia"
            if not petsitter.offers_walk and not petsitter.offers_daycare:
                return jsonify({"msg": "Este cuidador no ofrece el servicio seleccionado"}), 400
            
            # Si tiene horas de inicio y fin, se calcula por horas
            if start_time and end_time:
                t1 = datetime.strptime(start_time, "%H:%M")
                t2 = datetime.strptime(end_time, "%H:%M")
                hours = (t2 - t1).seconds / 3600.0
                if hours <= 0:
                    hours = 1.0 # Mínimo una hora
                total_price = days * hours * (petsitter.price_per_hour or 0.0)
            else:
                # Si no se definen horas, asumimos un valor plano por día basado en precio de hora (ej: estimación estándar de 4 horas)
                total_price = days * 4.0 * (petsitter.price_per_hour or 0.0)

    except ValueError:
        return jsonify({"msg": "Formato de fechas u horas inválido"}), 400

    # Crear la Reserva
    new_booking = Booking(
        owner_id=owner.id,
        petsitter_id=petsitter.id,
        pet_id=pet.id,
        service_type=service_type,
        start_date=start_date,
        end_date=end_date,
        start_time=start_time,
        end_time=end_time,
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
    new_status = data.get('status') # "approvado", "rechazado", "completado", "cancelado"

    if not new_status:
        return jsonify({"msg": "Falta el nuevo estado"}), 400

    booking = db.session.get(Booking, booking_id)
    if not booking:
        return jsonify({"msg": "Reserva no encontrada"}), 404

    # Validación de estados permitidos
    if new_status not in ["approved", "rejected", "completed", "cancelled"]:
        return jsonify({"msg": "Estado de reserva inválido"}), 400

    booking.status = new_status

    # Si se completa, podemos autoincrementar la cantidad de bookings en el cuidador
    if new_status == "completed":
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