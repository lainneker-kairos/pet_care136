from flask import Blueprint, request, jsonify
from database import db
from models.user import Petsitter
from models.booking import Booking
from datetime import datetime

petsitter_bp = Blueprint('petsitter_bp', __name__)

# ==========================================
# OBTENER LISTA DE CUIDADORES CON FILTROS
# ==========================================
@petsitter_bp.route('/petsitters', methods=['GET'])
def get_petsitters():
    
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
        if service == 'walk' or service == 'paseo':
            query = query.filter(Petsitter.offers_walk == True)
        elif service == 'daycare' or service == 'guarderia':
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

    petsitters = db.session.execute(query).scalars().all()

    if start_date_str and end_date_str:
        try:
            # strings a fechas de Python
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            
            disponibles = []
            
            for petsitter in petsitters:                
                reservas_conflictivas = db.session.execute(
                    db.select(Booking).filter(
                        Booking.petsitter_id == petsitter.id,
                        Booking.status == 'aceptado', 
                        Booking.start_date <= end_date, 
                        Booking.end_date >= start_date  
                    )
                ).scalars().first()
                
                # validacion: si no hay reservas conflictivas, el petsitter está disponible
                if not reservas_conflictivas:
                    disponibles.append(petsitter)
            
            # Reemplazamos la lista general por disponibles
            petsitters = disponibles
            
        except ValueError:
            return jsonify({"msg": "Formato de fechas inválido. Use YYYY-MM-DD"}), 400
        
    results = []
    for petsitter in petsitters:
        petsitter_data = petsitter.serialize()
        
        # Calculamos el precio estimado para la búsqueda del frontend
        estimated_price = 0.0
        
        if service in ['walk', 'paseo', 'daycare', 'guarderia']:
            base_price = petsitter.price_per_hour or 0.0
            if duration_hours:
                estimated_price = base_price * duration_hours
            else:
                # Por defecto devolvemos su tarifa por hora estándar
                estimated_price = base_price * 8 if service in ['daycare', 'guarderia'] else base_price
                
        elif service in ['hotel', 'nightcare']:
            base_price = petsitter.price_per_night or 0.0
            if start_date_str and end_date_str:
                try:
                    d1 = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                    d2 = datetime.strptime(end_date_str, "%Y-%m-%d").date()
                    days = (d2 - d1).days
                    days = 1 if days <= 0 else days
                    estimated_price = base_price * days
                except ValueError:
                    estimated_price = base_price
            else:
                estimated_price = base_price
    
    # Agregamos el precio calculado al JSON de respuesta
        petsitter_data['estimated_price'] = round(estimated_price, 2)
        results.append(petsitter_data)

    return jsonify(results), 200