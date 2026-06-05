from sqlalchemy import String, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db

class Pet(db.Model):
    __tablename__ = "pet"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    species: Mapped[str] = mapped_column(String(50), nullable=False) # Perro, Gato, etc.
    breed: Mapped[str] = mapped_column(String(50), nullable=True) # Raza
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Relación con el dueño (User)
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    owner: Mapped["User"] = relationship(back_populates="pets")

    # Relación con reservas (una mascota puede estar en varias reservas a lo largo del tiempo)
    bookings: Mapped[list["Booking"]] = relationship(back_populates="pet")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "species": self.species,
            "breed": self.breed,
            "age": self.age,
            "description": self.description,
            "owner_id": self.owner_id
        }