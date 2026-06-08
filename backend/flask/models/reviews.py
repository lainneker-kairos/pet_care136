from __future__ import annotations
from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .booking import Booking
    from .user import User

class Review(db.Model):
    __tablename__ = "review"

    id: Mapped[int] = mapped_column(primary_key=True)
    booking_id: Mapped[int] = mapped_column(ForeignKey("booking.id"), nullable=False)
    reviewer_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    reviewed_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=True)
    review_type: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    booking: Mapped[Booking] = relationship(back_populates="reviews")
    reviewer: Mapped[User] = relationship(foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewed: Mapped[User] = relationship(foreign_keys=[reviewed_id], back_populates="reviews_received")

    def serialize(self):
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "reviewer_id": self.reviewer_id,
            "reviewed_id": self.reviewed_id,
            "rating": self.rating,
            "comment": self.comment,
            "review_type": self.review_type,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }