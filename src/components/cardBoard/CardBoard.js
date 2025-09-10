import React from "react";
import img from "../../assets/images/i1.jpg";
import "./CardBoard.css";

function CardBoard({ name, onEdit, onDelete, onClick }) {
  return (
    <div className="card board-card mt-3" onClick={onClick}>
      <div className="position-relative">
        <img src={img} className="card-img-top board-card-img" alt={name} />

        {/* Top-right corner icons (visible on hover only) */}
        <div className="card-actions">
          <i
            className="bi bi-pencil-fill"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          ></i>
          <i
            className="bi bi-trash-fill"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          ></i>
        </div>
      </div>

      <div className="card-body board-card-body text-center bg-dark">
        <h6 className="card-title text-secondary mb-0">{name}</h6>
      </div>
    </div>
  );
}

export default CardBoard;
