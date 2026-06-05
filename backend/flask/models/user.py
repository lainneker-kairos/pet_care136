
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Table, Column, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from database import db

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    
    username: Mapped[str] = mapped_column( String(40), unique=True, nullable=False)
    email: Mapped[str] = mapped_column( String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped [str] = mapped_column(String(20), nullable=False, default="owner")

# --- RELACIONES ---
# Un dueño puede tener varias mascotas
    pets: Mapped[List["Pet"]] = relationship(back_populates="owner", cascade="all, delete-orphan")

    # Un cuidador puede ofrecer varios servicios
    services: Mapped[List["Service"]] = relationship(back_populates="petsitter", cascade="all, delete-orphan")

    # Un cuidador tiene disponibilidades
    availabilities: Mapped[List["Availability"]] = relationship(back_populates="petsitter", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
        }