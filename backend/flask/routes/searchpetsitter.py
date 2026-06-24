from flask import Blueprint, request, jsonify
from database import db
from models.user import Petsitter
from models.booking import Booking
from datetime import datetime
from sqlalchemy import and_

searchpetsitter_bp = Blueprint('searchpetsitter_bp', __name__)

# ==========================================
# OBTENER LISTA DE CUIDADORES CON FILTROS
# ==========================================
@searchpetsitter_bp.route('/searchpetsitters', methods=['GET'])
def get_searchpetsitters():
    
    city = request.args.get('city')
    service = request.args.get('service_type') or request.args.get('service')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')
    duration_hours = request.args.get('duration_hours', type=float)
    
    if start_date_str and not end_date_str:
        end_date_str = start_date_str
    
    query = db.select(Petsitter)

    #filtro ciudad
    if city: 
        query = query.filter(Petsitter.city.ilike(f"%{city}%"))

    #filtro servicio
    if service:
        if service in ['walk', 'paseo']:
            query = query.filter(Petsitter.offers_walk == True)
        elif service  in ['daycare', 'guarderia']:
            query = query.filter(Petsitter.offers_daycare == True)
        elif service == 'hotel':
            query = query.filter(Petsitter.offers_hotel == True)
        elif service == 'nightcare':
            query = query.filter(Petsitter.offers_nightcare == True)

    #  Filtro por rango de precio
    if min_price is not None or max_price is not None:
        if service in ['walk', 'paseo', 'daycare', 'guarderia']:
            if min_price is not None:
                query = query.filter(Petsitter.price_per_hour >= min_price)
            if max_price is not None:
                query = query.filter(Petsitter.price_per_hour <= max_price)
        elif service in ['hotel', 'nightcare']:
            if min_price is not None:
                query = query.filter(Petsitter.price_per_night >= min_price)
            if max_price is not None:
                query = query.filter(Petsitter.price_per_night <= max_price)

    # Filtro por disponibilidad de fechas
    if start_date_str and end_date_str:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            
            # cambio del FOR, filtramos directamente en la consulta SQL.
            # "~" significa "NOT". Es decir: "Donde NO exista ninguna reserva que cumpla esto:"
            query = query.filter(
                ~Petsitter.bookings.any(
                    and_(
                        Booking.status == 'aceptado', 
                        Booking.start_date <= end_date, 
                        Booking.end_date >= start_date  
                    )
                )
            )
            
        except ValueError:
            return jsonify({"msg": "Formato de fechas inválido. Use YYYY-MM-DD"}), 400
        
    # Ejecutamos LA ÚNICA consulta a la base de datos
    petsitters = db.session.execute(query).scalars().all()
        
    results = []
    for petsitter in petsitters:
        petsitter_data = petsitter.serialize()
        
        # Calculamos el precio estimado para la búsqueda del frontend
        estimated_price = 0.0
        
        if service in ['walk', 'paseo', 'daycare', 'guarderia']:
            base_price = float(petsitter.price_per_hour or 0.0)
            # Si el usuario especifica horas, usamos eso, si no, mínimo 1 hora
            hours = duration_hours if duration_hours and duration_hours > 0 else 1.0
            estimated_price = base_price * hours
                
        elif service in ['hotel', 'nightcare']:
            base_price = float(petsitter.price_per_night or 0.0)
            if start_date_str and end_date_str:
                try:
                    d1 = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                    d2 = datetime.strptime(end_date_str, "%Y-%m-%d").date()
                    nights = (d2 - d1).days
                    nights = 1 if nights <= 0 else nights
                    estimated_price = base_price * nights
                except ValueError:
                    estimated_price = float(base_price)
            else:
                estimated_price = float(base_price)
    
    # precio calculado al JSON de respuesta
        petsitter_data['estimated_price'] = round(estimated_price, 2)
        results.append(petsitter_data)

    return jsonify(results), 200