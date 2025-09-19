import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { useRef } from "react";
import CardModal from "./CardModal";

const SortableCard = ({ id, title, type, imageName, thumbnail }) => {
  const modalRef = useRef(null);

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
    cursor: "grab",
    opacity: isDragging ? 0 : 1,
    maxWidth: "250px",
    overflowWrap: "break-word",
  };

  // Function to open modal
  const openModal = () => {
    console.log("Card clicked");
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  return (
    <>
      {/* CARD */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={openModal}
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
              target="_blank"
              rel="noopener noreferrer"
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

      {/* MODAL */}
      <CardModal ref={modalRef} title={title} />
    </>
  );
};

export default SortableCard;
