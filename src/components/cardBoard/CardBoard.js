import React from "react";
import PropTypes from "prop-types";
import "./CardBoard.css";

function CardBoard({ imgSrc, title, className = "", variant }) {
  if (variant !== "image" && variant !== "add") {
    throw new Error(
      `❌ Invalid variant "${variant}" supplied to CardBoard. Expected "image" or "add".`
    );
  }

  return (
    <div className={`card board-card border-0 ${className}`}>
      {variant === "image" && (
        <>
          <div className="position-relative">
            <img
              src={imgSrc}
              className="card-img-top board-card-img border-0"
              alt={title}
            />

            <div className="card-actions">
              <i
                className="bi bi-pencil-fill"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              ></i>
              <i
                className="bi bi-trash-fill"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#deleteModal"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              ></i>
            </div>
          </div>

          <div className="card-body board-card-body text-center bg-dark">
            <h6 className="card-title title mb-3">{title}</h6>
          </div>
        </>
      )}

      {variant === "add" && (
        <div className="d-flex flex-column align-items-center justify-content-center board-card-img bg-dark add-board">
          <i className="bi bi-plus-lg fs-3 text-light mb-2"></i>
          <h6 className="title text-light mb-0">{title}</h6>
        </div>
      )}
    </div>
  );
}

CardBoard.propTypes = {
  imgSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["image", "add"]).isRequired,
};

export default CardBoard;
