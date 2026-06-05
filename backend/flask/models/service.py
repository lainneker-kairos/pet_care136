from sqlalchemy import String, Integer, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db

class Service(db.Model):
    __tablename__ = "service"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False) # Ej: Paseo, Alojamiento
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    
    # Relación con el cuidador (User)
    petsitter_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    petsitter: Mapped["User"] = relationship(back_populates="services")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "petsitter_id": self.petsitter_id
        }

class Availability(db.Model):
    __tablename__ = "availability"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[str] = mapped_column(String(20), nullable=False) # Ej: YYYY-MM-DD
    start_time: Mapped[str] = mapped_column(String(10), nullable=False) # Ej: 08:00
    end_time: Mapped[str] = mapped_column(String(10), nullable=False)   # Ej: 18:00
    
    # Relación con el cuidador (User)
    petsitter_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    petsitter: Mapped["User"] = relationship(back_populates="availabilities")

    def serialize(self):
        return {
            "id": self.id,
            "date": self.date,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "petsitter_id": self.petsitter_id
        }