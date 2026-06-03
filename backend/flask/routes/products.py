from flask import Blueprint, jsonify, request
from database import db

products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    return jsonify({"msg": "Todo bien"})