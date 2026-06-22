from __future__ import annotations
from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db
from typing import List, TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import Numeric

# Usamos TYPE_CHECKING para evitar importaciones circulares
#comentario israel 

if TYPE_CHECKING:
    from .pets import Pet
    from .booking import Booking
    from .reviews import Review
    from .availability import Availability
# ==========================================
# TABLA BASE: USUARIOS
# ==========================================
class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="owner", nullable=True) # "owner" 
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relaciones 1 a 1
    owner_profile: Mapped[Owner] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    petsitter_profile: Mapped[Petsitter] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")

    # Relaciones 1 a N para reseñas (quien escribe y quien recibe)
    reviews_given: Mapped[List[Review]] = relationship("Review", foreign_keys="[Review.reviewer_id]", back_populates="reviewer")
    reviews_received: Mapped[List[Review]] = relationship("Review", foreign_keys="[Review.reviewed_id]", back_populates="reviewed")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

# ==========================================
# PERFIL: DUEÑO
# ==========================================
class Owner(db.Model):
    __tablename__ = "owner"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), unique=True, nullable=False)
    
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    neighborhood: Mapped[str] = mapped_column(String(100), nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    profile_pic: Mapped[str] = mapped_column(String(255), nullable=True)
    max_budget: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    # Relaciones
    user: Mapped[User] = relationship(back_populates="owner_profile")
    pets: Mapped[List[Pet]] = relationship(back_populates="owner", cascade="all, delete-orphan")
    bookings: Mapped[List[Booking]] = relationship(back_populates="owner")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "phone": self.phone,
            "city": self.city,
            "neighborhood": self.neighborhood,
            "bio": self.bio,
            "profile_pic": self.profile_pic,
            "max_budget": float(self.max_budget) if self.max_budget is not None else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# ==========================================
# PERFIL: PETSITTER (CUIDADOR)
# ==========================================
class Petsitter(db.Model):
    __tablename__ = "petsitter"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), unique=True, nullable=False)
    
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    neighborhood: Mapped[str] = mapped_column(String(100), nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    profile_pic: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # Atributos profesionales
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    certifications: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Servicios ofrecidos
    offers_walk: Mapped[bool] = mapped_column(Boolean, default=False)
    offers_hotel: Mapped[bool] = mapped_column(Boolean, default=False)
    offers_daycare: Mapped[bool] = mapped_column(Boolean, default=False)
    offers_nightcare: Mapped[bool] = mapped_column(Boolean, default=False)
    
    available_days: Mapped[str] = mapped_column(String(100), nullable=True)
    accepted_dog_sizes: Mapped[str] = mapped_column(String(100), nullable=True)
    
    price_per_hour: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=True)
    price_per_night: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=True)
    
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    booking_count: Mapped[int] = mapped_column(Integer, default=0)
    google_calendar_id: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    user: Mapped[User] = relationship(back_populates="petsitter_profile")
    availabilities: Mapped[List[Availability]] = relationship(back_populates="petsitter", cascade="all, delete-orphan")
    bookings: Mapped[List[Booking]] = relationship(back_populates="petsitter")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "phone": self.phone,
            "city": self.city,
            "neighborhood": self.neighborhood,
            "bio": self.bio,
            "profile_pic": self.profile_pic,
            "experience_years": self.experience_years,
            "certifications": self.certifications,
            "offers_walk": self.offers_walk,
            "offers_hotel": self.offers_hotel,
            "offers_daycare": self.offers_daycare,
            "offers_nightcare": self.offers_nightcare,
            "available_days": self.available_days,
            "accepted_dog_sizes": self.accepted_dog_sizes,
            "price_per_hour": float(self.price_per_hour) if self.price_per_hour is not None else None,
            "price_per_night": float(self.price_per_night) if self.price_per_night is not None else None,
            "rating": self.rating,
            "booking_count": self.booking_count,
            "google_calendar_id": self.google_calendar_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }