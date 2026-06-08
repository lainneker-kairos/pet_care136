from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
import os
from routes.user import user_bp
from routes.pets import pets_bp  
from routes.booking import bookings_bp

# Importacion de modelos
from models.user import User, Owner, Petsitter
from models.pets import Pet
from models.availability import Availability
from models.booking import Booking
from models.reviews import Review

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

db.init_app(app)

app.register_blueprint(user_bp)
app.register_blueprint(pets_bp)  
app.register_blueprint(bookings_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=False)