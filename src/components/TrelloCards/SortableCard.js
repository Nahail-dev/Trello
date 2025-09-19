import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";

const SortableCard = ({ id, title, type, imageName, thumbnail, onClick }) => {
  // Drag and Drop config
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "5px 15px",
    backgroundColor: "#22272b",
    borderRadius: "6px",
    marginBottom: "8px",
    color: "#b6c2cf",
    cursor: isDragging ? "grabbing" : "pointer",
    opacity: isDragging ? 0 : 1,
    maxWidth: "250px",
    overflowWrap: "break-word",
  };

  const { onClick: _ignoreOnClick, ...safeListeners } = listeners || {};

  const handleClick = (e) => {
    // Prevent click during drag
    if (isDragging) return;
    onClick?.(e);
  };

  return (
    <>
      {/* CARD */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...safeListeners}
        onClick={handleClick}
      >
        {type === "text" && <p style={{ margin: 0 }}>{title}</p>}

        {type === "image" && (
          <div style={{ textAlign: "center" }}>
            <img
              src={title}
              alt={imageName}
              style={{
                width: "100%",
                borderRadius: "4px",
                maxHeight: "150px",
                objectFit: "cover",
                display: "block",
                marginBottom: "6px",
              }}
            />
            <div style={{ fontSize: "12px", color: "#8b9aa7" }}>
              {imageName}
            </div>
          </div>
        )}

        {type === "link" && (
          <div>
            {thumbnail && (
              <img
                src={thumbnail}
                alt="link-preview"
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  maxHeight: "150px",
                  objectFit: "cover",
                  display: "block",
                  marginBottom: "6px",
                }}
              />
            )}
            <Link
              to={title}
              onClick={(e) => {
                // Prevent navigation; click opens modal instead
                e.preventDefault();
                handleClick(e);
              }}
              style={{
                color: "#4ea3ff",
                textDecoration: "none",
                display: "block",
                fontWeight: 500,
                overflowWrap: "break-word",
              }}
            >
              {title}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SortableCard;
