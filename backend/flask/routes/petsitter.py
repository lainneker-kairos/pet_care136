from flask import Blueprint, request, jsonify
from database import db
from models.user import Petsitter

petsitter_bp = Blueprint('petsitter_bp', __name__)

# ==========================================
# OBTENER LISTA DE CUIDADORES CON FILTROS
# ==========================================
@petsitter_bp.route('/petsitters', methods=['GET'])
def get_petsitters():
    
    city = request.args.get('city')
    service = request.args.get('service')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    query = db.select(Petsitter)
    
    if city:
        
        query = query.filter(Petsitter.city.ilike(f"%{city}%"))
    
    if service:
        if service == 'walk':
            query = query.filter(Petsitter.offers_walk == True)
        elif service == 'daycare':
            query = query.filter(Petsitter.offers_daycare == True)
        elif service == 'hotel':
            query = query.filter(Petsitter.offers_hotel == True)
        elif service == 'nightcare':
            query = query.filter(Petsitter.offers_nightcare == True)

    #  Filtro por Rango de Precio
    if min_price is not None or max_price is not None:
        #  paseo o guardería por precio, hora
        if service in ['walk', 'daycare']:
            if min_price is not None:
                query = query.filter(Petsitter.price_per_hour >= min_price)
            if max_price is not None:
                query = query.filter(Petsitter.price_per_hour <= max_price)
        # Si busca hotel o cuidado nocturno, filtramos por precio por noche
        elif service in ['hotel', 'nightcare']:
            if min_price is not None:
                query = query.filter(Petsitter.price_per_night >= min_price)
            if max_price is not None:
                query = query.filter(Petsitter.price_per_night <= max_price)

    petsitters = db.session.execute(query).scalars().all()
    
    return jsonify([petsitter.serialize() for petsitter in petsitters]), 200