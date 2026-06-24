from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from database import db
import os

#importacion de rutas
from routes.user import user_bp
from routes.pets import pets_bp  
from routes.booking import bookings_bp
from routes.searchpetsitter import searchpetsitter_bp 



# Importacion de modelos
from models.user import User, Owner, Petsitter
from models.pets import Pet
from models.availability import Availability
from models.booking import Booking
from models.reviews import Review

load_dotenv()

app = Flask(__name__) # esto inicia el servidor de flask
CORS(app) # 

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')


db.init_app(app)
migrate = Migrate(app, db)

#registro de blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(pets_bp, url_prefix='/api')
app.register_blueprint(bookings_bp, url_prefix='/api')
app.register_blueprint(searchpetsitter_bp, url_prefix='/api')

if __name__ == '__main__':  # le dice a flask que app.py va a funcionar como el nucleo del proyecto
    
    with app.app_context():
        db.create_all() 
        print("Base de datos inicializada correctamente.")

app.run(debug=False)