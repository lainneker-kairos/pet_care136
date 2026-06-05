from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
import os
from routes.user import user_bp
from routes.products import products_bp
from routes.pets import pets_bp  
from routes.services_avail import services_bp
from routes.bookings_reviews import bookings_bp

# Importacion de modelos
from models.user import User
from models.pets import Pet
from models.service import Service, Availability
from models.booking import Booking, Review

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

db.init_app(app)

app.register_blueprint(user_bp)
app.register_blueprint(products_bp)
app.register_blueprint(pets_bp)  
app.register_blueprint(services_bp)
app.register_blueprint(bookings_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=False)