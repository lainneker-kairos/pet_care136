from __future__ import annotations
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import Petsitter

class Availability(db.Model):
    __tablename__ = "availability"

    id: Mapped[int] = mapped_column(primary_key=True)
    petsitter_id: Mapped[int] = mapped_column(ForeignKey("petsitter.id"), nullable=False)
    
    date: Mapped[str] = mapped_column(String(20), nullable=False) # YYYY-MM-DD
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    google_calendar_id: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relaciones
    petsitter: Mapped[Petsitter] = relationship(back_populates="availabilities")

    def serialize(self):
        return {
            "id": self.id,
            "petsitter_id": self.petsitter_id,
            "date": self.date,
            "is_available": self.is_available,
            "google_calendar_id": self.google_calendar_id
        }