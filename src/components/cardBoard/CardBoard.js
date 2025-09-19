import React from "react";
import PropTypes from "prop-types";
import "./CardBoard.css";
import  imgSrc  from "../../assets/images/i12.jpg";

function CardBoard({
  title,
  className = "",
  style,
  variant,
  background,
  onClick,
  onDelete,
}) {
  if (!["image", "gradient", "add"].includes(variant)) {
    throw new Error(
      `❌ Invalid variant "${variant}" supplied to CardBoard. Expected "image", "gradient" or "add".`
    );
  }

  // Determine the board style dynamically
  const boardStyle =
    variant === "gradient"
      ? { ...style, background: background } // apply gradient string
      : variant === "image"
      ? { ...style } // image will be rendered via <img>
      : {};

  return (
    <div
      className={`card board-card border-0 ${className}`}
      onClick={onClick}
      style={boardStyle}
    >
      {(variant === "image" || variant === "gradient") && (
        <>
          <div className="">
            {variant === "image" ? (
              <img
                src={background || imgSrc}
                className="card-img-top board-card-img border-0"
                alt={title}
              />
            ) : (
              // gradient: just a div with background applied via style
              <div className="card-img-top board-card-img border-0" />
            )}

            <div className="card-actions">
              <i
                className="bi bi-pencil-fill"
                onClick={(e) => e.stopPropagation()}
              ></i>
              <i
                className="bi bi-trash-fill"
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
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
  variant: PropTypes.oneOf(["image", "gradient", "add"]).isRequired,
  background: PropTypes.string, // ✅ gradient string or image path
  onDelete: PropTypes.func,
};

export default CardBoard;
