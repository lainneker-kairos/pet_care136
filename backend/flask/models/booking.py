from __future__ import annotations
from datetime import datetime, date, time
from sqlalchemy import String, Float, ForeignKey, Text, DateTime, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db
from typing import List, TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import Numeric

if TYPE_CHECKING:
    from .user import Owner, Petsitter
    from .pets import Pet
    from .reviews import Review

class Booking(db.Model):
    __tablename__ = "booking"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("owner.id"), nullable=False)
    petsitter_id: Mapped[int] = mapped_column(ForeignKey("petsitter.id"), nullable=False)
    pet_id: Mapped[int] = mapped_column(ForeignKey("pet.id"), nullable=False)
    
    service_type: Mapped[str] = mapped_column(String(50), nullable=False) # paseo, hotel, guarderia, etc.

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=True)
    end_time: Mapped[time] = mapped_column(Time, nullable=True)
    
    status: Mapped[str] = mapped_column(String(20), default="pending")
    total_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    comments: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    owner: Mapped[Owner] = relationship(back_populates="bookings")
    petsitter: Mapped[Petsitter] = relationship(back_populates="bookings")
    pet: Mapped[Pet] = relationship(back_populates="bookings")
    reviews: Mapped[List[Review]] = relationship(back_populates="booking")

    def serialize(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "petsitter_id": self.petsitter_id,
            "pet_id": self.pet_id,
            "service_type": self.service_type,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "status": self.status,
            "total_price": float(self.total_price) if self.total_price is not None else 0.0,
            "comments": self.comments,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }