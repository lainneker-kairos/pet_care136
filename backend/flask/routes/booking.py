from flask import Blueprint, request, jsonify
from database import db
from models.booking import Booking
from models.user import Owner, Petsitter
from models.pets import Pet
from datetime import datetime, timedelta
from decimal import Decimal
from extension_sockets import socketio
from models.notification import Notification

bookings_bp = Blueprint('bookings_bp', __name__)

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
    role = data.get('role')  # 'owner' o 'petsitter' 

    start_time = data.get('start_time')
    duration_hours = data.get('duration_hours')
    comments = data.get('comments')

    if not all([owner_id, petsitter_id, pet_id, service_type, start_date]):
         return jsonify({"msg": "Faltan campos requeridos para la reserva"}), 400

    owner = db.session.get(Owner, owner_id)
    petsitter = db.session.get(Petsitter, petsitter_id)
    pet = db.session.get(Pet, pet_id)

    if not owner or not petsitter or not pet:
        return jsonify({"msg": "Dueño, cuidador o mascota no válidos"}), 404

    if pet.owner_id != owner.id:
        return jsonify({"msg": "La mascota seleccionada no pertenece al dueño"}), 403
    
    if not end_date:
        end_date = start_date

    total_price = Decimal('8.0')
    
    try:
        # REFACTORIZACIÓN:  (días y horas)
        d1 = datetime.strptime(start_date, "%Y-%m-%d") .date()
        d2 = datetime.strptime(end_date, "%Y-%m-%d") .date()
        days = (d2 - d1).days

        if days < 0:
            return jsonify({"msg": "La fecha de fin no puede ser anterior a la de inicio"}), 400
        if days == 0:
            days = 1 

        t1_obj = None
        if start_time:
            time_str = start_time.replace("p. m.", "PM").replace("a. m.", "AM").strip()
            formats_to_try = ["%H:%M", "%I:%M %p", "%H:%M:%S"]
            for fmt in formats_to_try:
                try:
                    t1_obj = datetime.strptime(time_str, fmt).time()
                    break
                except ValueError:
                    continue
            if not t1_obj:
                return jsonify({"msg": "Formato de hora de inicio inválido. Use HH:MM"}), 400

        t2_obj = None
        hours_calculated = 1.0 
        
        if duration_hours is not None:
            try:
                hours_calculated = float(duration_hours)
            except ValueError:
                return jsonify({"msg": "La duración en horas debe ser un número válido"}), 400

        if t1_obj and (service_type in ["paseo", "guarderia"]):

            dt_start = datetime.combine(d1, t1_obj)
            dt_end = dt_start + timedelta (hours=hours_calculated)
            t2_obj = dt_end.time()
            
            # Si el servicio cruza la medianoche, ajustamos la fecha de fin
            if dt_end.date() > d1:
                d2 = dt_end.date()
        
        # Cálculo de precio usando Decimal
        days_dec = Decimal(str(days))
        hours_dec = Decimal(str(hours_calculated))    

        if service_type == "hotel":
            if not petsitter.offers_hotel:
                 return jsonify({"msg": "Este cuidador no ofrece servicio de hotel"}), 400
            total_price = days_dec * (petsitter.price_per_night or Decimal (0.0))

        elif service_type == "nightcare":
            if not petsitter.offers_nightcare:
                 return jsonify({"msg": "Este cuidador no ofrece servicio de cuidado nocturno"}), 400
            total_price = days_dec * (petsitter.price_per_night or Decimal (0.0))

        elif service_type == "paseo":
            if not petsitter.offers_walk:
                 return jsonify({"msg": "Este cuidador no ofrece servicio de paseo"}), 400
            
            total_price = days_dec * hours_dec * (petsitter.price_per_hour or Decimal (0.0))

        elif service_type == "guarderia":
            if not petsitter.offers_daycare:
                  return jsonify({"msg": "Este cuidador no ofrece servicio de guardería"}), 400
            
            total_price = days_dec * hours_dec * (petsitter.price_per_hour or Decimal (0.0))
        else:
            return jsonify({"msg": "Tipo de servicio no válido"}), 400

    except ValueError as e:
        return jsonify({"msg": f"Formato de fechas o datos inválidos {str(e)}"}), 400

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

    # Crear y guardar la notificación en la Base de Datos
    new_notification = Notification(
        user_id=petsitter.user_id, # Enviamos al user_id base del cuidador
        title="¡Nueva solicitud de servicio! 🐾",
        message=f"{owner.name} necesita que cuides de {pet.name}.",
        type="new_request"
    )
    db.session.add(new_notification)
    db.session.commit()


  # EMITIR NOTIFICACIÓN AL PETSITTER
    room_name = f"user_{petsitter.user_id}"
    notification_data = {
        "id": new_notification.id,
        "type": new_notification.type,
        "title": new_notification.title,
        "message": new_notification.message,
        "service": service_type,
        "pet_photo": pet.photo,
        "booking_id": new_booking.id,
        "is_read": False,
        "redirect_url": "/perfil-owner/reservas" if role == 'owner' else "/perfil-petsitter/reservas"
    }
    socketio.emit('new_notification', notification_data, room=room_name)

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
    role = data.get('role')  # 'owner' o 'petsitter'

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

     #propuesta para hacer mas natural el mensaje
    status_nat = {
        "aceptado": "aceptada",
        "rechazado": "declinada",
        "completado": "completada",
        "cancelado": "cancelada"
    }.get(new_status, new_status)

     #  Crear y guardar la notificación en la Base de Datos para el Dueño
    new_notification = Notification(
        user_id=booking.owner.user_id, # Usamos la relación de la reserva para llegar al user_id del dueño
        title=f"Reserva {status_nat.capitalize()} 🐾",
        message=f"Tu solicitud con {booking.petsitter.name} para {booking.pet.name} ha sido {status_nat}.",
        type="status_update"
    )
    db.session.add(new_notification)
    db.session.commit()

  # EMITIR NOTIFICACIÓN AL OWNER
    room_name = f"user_{booking.owner.user_id}"

    notification_data = {
        "id": new_notification.id,
        "type": new_notification.type,
        "title": new_notification.title,
        "message": new_notification.message,
        "status": new_status,
        "booking_id": booking.id,
        "is_read": False,
        "redirect_url": "/perfil-owner/reservas" if role == 'owner' else "/perfil-petsitter/reservas"
    }
    
    socketio.emit('new_notification', notification_data, room=room_name)

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