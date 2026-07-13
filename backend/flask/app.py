import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from database import db
import os
from sqlalchemy.pool import NullPool

# Importacion de routes
from routes.user import user_bp
from routes.pets import pets_bp  
from routes.booking import bookings_bp
from routes.calendar import calendar_bp
from routes.maps import maps_bp
from routes.searchpetsitter import searchpetsitter_bp
from routes.reviews import reviews_bp
# Importacion de modelos
from models.user import User, Owner, Petsitter
from models.pets import Pet
from models.availability import Availability
from models.booking import Booking
from models.reviews import Review
from models.notification import Notification

# Importar la instancia de socketio
from extension_sockets import socketio

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://pet-care136-pr.vercel.app"
])

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(pets_bp, url_prefix='/api')
app.register_blueprint(bookings_bp, url_prefix='/api')
app.register_blueprint(calendar_bp)
app.register_blueprint(maps_bp)
app.register_blueprint(searchpetsitter_bp, url_prefix='/api')
app.register_blueprint(reviews_bp, url_prefix='/api')



# Inicializar SocketIO con la app de Flask
socketio.init_app(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, debug=False, host='0.0.0.0', port=port)