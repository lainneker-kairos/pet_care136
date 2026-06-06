from __future__ import annotations
from sqlalchemy import String, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .user import Owner
    from .booking import Booking

class Pet(db.Model):
    __tablename__ = "pet"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("owner.id"), nullable=False)
    
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    species: Mapped[str] = mapped_column(String(50), nullable=False)
    breed: Mapped[str] = mapped_column(String(50), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    size: Mapped[str] = mapped_column(String(20), nullable=True)
    tags: Mapped[str] = mapped_column(String(255), nullable=True)
    behavior: Mapped[str] = mapped_column(Text, nullable=True)
    allergies: Mapped[str] = mapped_column(Text, nullable=True)
    medications: Mapped[str] = mapped_column(Text, nullable=True)
    special_notes: Mapped[str] = mapped_column(Text, nullable=True)
    photo: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relaciones
    owner: Mapped[Owner] = relationship(back_populates="pets")
    bookings: Mapped[List[Booking]] = relationship(back_populates="pet")

    def serialize(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "species": self.species,
            "breed": self.breed,
            "age": self.age,
            "size": self.size,
            "tags": self.tags,
            "behavior": self.behavior,
            "allergies": self.allergies,
            "medications": self.medications,
            "special_notes": self.special_notes,
            "photo": self.photo
        }