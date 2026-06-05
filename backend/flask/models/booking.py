from sqlalchemy import String, Integer, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db

class Booking(db.Model):
    __tablename__ = "booking"

    id: Mapped[int] = mapped_column(primary_key=True)
    start_date: Mapped[str] = mapped_column(String(20), nullable=False)
    end_date: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending") #pendiente, aceptada, rechazada
    total_price: Mapped[float] = mapped_column(Float, nullable=False)

    # Relaciones
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    petsitter_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    pet_id: Mapped[int] = mapped_column(ForeignKey("pet.id"), nullable=False)
    service_id: Mapped[int] = mapped_column(ForeignKey("service.id"), nullable=False)

    pet: Mapped["Pet"] = relationship(back_populates="bookings")

    def serialize(self):
        return {
            "id": self.id,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "status": self.status,
            "total_price": self.total_price,
            "owner_id": self.owner_id,
            "petsitter_id": self.petsitter_id,
            "pet_id": self.pet_id,
            "service_id": self.service_id
        }

class Review(db.Model):
    __tablename__ = "review"

    id: Mapped[int] = mapped_column(primary_key=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False) # 1 al 5
    comment: Mapped[str] = mapped_column(String(255), nullable=True)

    # Quién escribe la reseña (dueño) y a quién se la escribe (cuidador)
    reviewer_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    petsitter_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment,
            "reviewer_id": self.reviewer_id,
            "petsitter_id": self.petsitter_id
        }