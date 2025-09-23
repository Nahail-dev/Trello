import React, { forwardRef, useState, useEffect } from "react";
import ActionDropdown from "./ActionDropdown";

const CardModal = forwardRef(
  ({ title, listTitle, onClose, onUpdateTitle, listId, cardId }, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftTitle, setDraftTitle] = useState(title || "");

    // keep draft in sync when title prop changes
    useEffect(() => {
      setDraftTitle(title || "");
    }, [title]);

    const startEdit = () => setIsEditing(true);
    const cancelEdit = () => {
      setDraftTitle(title || "");
      setIsEditing(false);
    };
    const commitEdit = () => {
      const trimmed = (draftTitle || "").trim();
      if (!trimmed || !onUpdateTitle) return setIsEditing(false);
      onUpdateTitle(listId, cardId, trimmed);
      setIsEditing(false);
    };

    // Auto-grow handler for description: keeps a fixed starting height and expands with content
    const handleDescriptionInput = (e) => {
      const el = e.target;
      const minPx = 96; // ~4 rows default
      const maxPx = Math.round(window.innerHeight * 0.45); // cap at ~45vh
      el.style.height = "auto";
      const newH = Math.max(minPx, Math.min(el.scrollHeight, maxPx));
      el.style.height = newH + "px";
    };

    // Initialize Bootstrap tooltips for action tags within this modal
    useEffect(() => {
      const root = ref && "current" in ref ? ref.current : null;
      const bs = typeof window !== "undefined" ? window.bootstrap : null;
      if (!root || !bs || !bs.Tooltip) return;
      const nodes = root.querySelectorAll('[data-bs-toggle="tooltip"]');
      const tooltips = Array.from(nodes).map((el) => new bs.Tooltip(el));
      return () => {
        tooltips.forEach((t) => {
          try {
            t.dispose();
          } catch {}
        });
      };
    }, [ref]);

    return (
      <div className="modal fade" ref={ref} tabIndex="-1" aria-hidden="true">
        {/* Scoped responsive styles for the dialog padding (outer margins) */}
        <style>
          {`
        .card-modal-dialog {
          position: fixed !important;
          inset: 0 !important;
          margin: 0 !important;
          width: 100vw !important;
          max-width: 100vw !important;
          height: 100vh !important;
          display: flex !important;
          box-sizing: border-box !important;
          padding: 7vh 20vw !important; /* 10% top/bottom, 20% left/right */
        }
        /* Left pane inputs match left pane background */
        .card-left-pane input,
        .card-left-pane textarea,
        .card-left-pane .form-control {
          background-color: #12151a !important;
          color: #ffffff !important;
          border: 1px solid rgba(255,255,255,0.18) !important;
          box-shadow: none !important;
        }
        /* Title input: no background, no box, only bottom border */
        .card-modal-content .card-title-input {
          background-color: #12151a !important;
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.35) !important;
          border-radius: 0 !important;
          color: #ffffff !important;
          box-shadow: none !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .card-modal-content .card-title-input:focus {
          border-bottom-color: rgba(255,255,255,0.6) !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .card-left-pane input:focus,
        .card-left-pane textarea:focus,
        .card-left-pane .form-control:focus {
          background-color: #12151a !important;
          color: #ffffff !important;
          border-color: rgba(255,255,255,0.35) !important;
          box-shadow: none !important;
          outline: none !important;
        }
        /* Edit card button hover effect */
        .card-modal-content .edit-card-btn {
          transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
        }
        .card-modal-content .edit-card-btn:hover,
        .card-modal-content .edit-card-btn:focus {
          background-color: #1a1d21 !important;
          color: #d6e0ea !important;
          border-color: #2a2f36 !important;
          box-shadow: none !important;
        }
        /* Action label buttons hover effect */
        .card-modal-content .tag-btn {
          transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
        }
        .card-modal-content .tag-btn:hover,
        .card-modal-content .tag-btn:focus {
          background-color: #1a1d21 !important;
          color: #d6e0ea !important;
          border-color: #2a2f36 !important;
          box-shadow: none !important;
        }
        /* Themed scrollbars inside the modal (scoped) */
        .card-modal-content,
        .card-modal-content * {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: rgba(182,194,207,0.35) rgba(0,0,0,0.25); /* thumb track */
        }
        .card-modal-content ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .card-modal-content ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.25);
          border-radius: 8px;
        }
        .card-modal-content ::-webkit-scrollbar-thumb {
          background-color: rgba(182,194,207,0.45);
          border-radius: 8px;
          border: 2px solid rgba(0,0,0,0.25);
        }
        .card-modal-content ::-webkit-scrollbar-thumb:hover {
          background-color: rgba(182,194,207,0.65);
        }
        /* Description field behavior: fixed initial height, no manual resize */
        .auto-grow-textarea {
          resize: none !important;
        }
        .card-modal-content ::placeholder {
          color: rgba(255,255,255,0.65) !important;
          opacity: 1; /* Firefox */
        }
        @media (max-width: 1199px) {
          .card-modal-dialog { padding: 10vh 14vw !important; }
        }
        @media (max-width: 991px) {
          .card-modal-dialog { padding: 10vh 10vw !important; }
        }
        @media (max-width: 767px) {
          .card-modal-dialog { padding: 10vh 6vw !important; }
        }
        @media (max-width: 479px) {
          .card-modal-dialog { padding: 10vh 4vw !important; }
        }
        /* Tablet and below: stack body columns and minimize right pane info */
        @media (max-width: 991px) {
          .card-modal-body { flex-direction: column !important; }
          .card-left-pane { padding: 12px 16px !important; }
          .card-right-pane {
            width: 100% !important;
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
            padding: 12px 16px !important;
          }
          .card-right-pane .activity { display: none !important; }
        }
        `}
        </style>
        <div className="modal-dialog card-modal-dialog">
          <div
            className="modal-content border-0 card-modal-content"
            style={{
              minWidth: 0,
              height: "48vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#12151a",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* Top Bar with List Name */}
            <div
              className="modal-header"
              style={{
                backgroundColor: "#12151a",
                color: "#b6c2cf",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                padding: "0.9rem 1rem",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge"
                  style={{
                    backgroundColor: "#22272b",
                    color: "#a6c5e2",
                    fontSize: "16px",
                  }}
                >
                  {listTitle || "Untitled List"}
                </span>
                <span style={{ color: "#738496", fontSize: 12 }}>List</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div
              className="modal-body d-flex p-0 card-modal-body"
              style={{
                flex: 1,
                overflow: "hidden",
                backgroundColor: "#242528",
              }}
            >
              {/* LEFT SIDE */}
              <div
                className="flex-grow-1 p-4 card-left-pane"
                style={{
                  backgroundColor: "#12151a",
                  color: "#fff",
                  overflowY: "auto",
                  backdropFilter: "blur(2px)",
                }}
              >
                {/* Card Name row with background */}
                <div
                  className="d-flex align-items-center justify-content-between mt-2"
                  style={{
                    background: "#12151a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    gap: 12,
                  }}
                >
                  {!isEditing ? (
                    <>
                      <h3
                        className="fw-bold mb-0 fs-5"
                        style={{
                          color: "#d6e0ea",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {title}
                      </h3>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light edit-card-btn"
                        onClick={startEdit}
                        title="Edit card name"
                        style={{ borderColor: "#2a2f36", color: "#b6c2cf" }}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="form-control form-control-sm card-title-input me-2"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={commitEdit}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {/* From which list */}
                <div style={{ color: "#8b9aa7", fontSize: 13 }}>
                  In list:{" "}
                  <strong style={{ color: "#a6c5e2" }}>
                    {listTitle || "Untitled List"}
                  </strong>
                </div>

                {/* Action Tags Row */}
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {[
                    { key: "add", label: "Add", icon: "bi-plus" },
                    { key: "labels", label: "Labels", icon: "bi-tag" },
                    { key: "dates", label: "Dates", icon: "bi-clock" },
                    {
                      key: "checklist",
                      label: "Checklist",
                      icon: "bi-check2-square",
                    },
                    { key: "members", label: "Members", icon: "bi-people" },
                  ].map((item) => (
                    <ActionDropdown
                      key={item.key}
                      variant={item.key} // <- tells dropdown which content to show
                      button={
                        <button
                          type="button"
                          className="btn btn-sm d-flex align-items-center tag-btn"
                          title={item.label}
                          style={{
                            
                            color: "#b6c2cf",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 8,
                            padding: "6px 10px",
                          }}
                        >
                          <i
                            className={`bi ${item.icon}`}
                            style={{ marginRight: 6, opacity: 0.9 }}
                          />
                          {item.label}
                        </button>
                      }
                      labels={[
                        { id: 1, name: "Bug", color: "#e74c3c" },
                        { id: 2, name: "Feature", color: "#27ae60" },
                        { id: 3, name: "High Priority", color: "#f39c12" },
                      ]}
                      members={[
                        { id: 1, name: "Alice" },
                        { id: 2, name: "Bob" },
                        { id: 3, name: "Charlie" },
                      ]}
                      onSelect={(type, value) =>
                        console.log("Selected:", type, value)
                      }
                    />
                  ))}
                </div>

                {/* Description Section */}
                <div className="mt-4">
                  <h6 className="text-light">Description</h6>
                  <textarea
                    className="form-control bg-dark text-light border-secondary mt-2 auto-grow-textarea"
                    placeholder="Add a more detailed description..."
                    style={{ height: "70px", overflowY: "auto" }}
                    onInput={handleDescriptionInput}
                  />
                </div>
              </div>
              {/* RIGHT SIDE */}
              <div
                className="p-4 border-start card-right-pane"
                style={{
                  width: "320px",
                  backgroundColor: "#0f1114",
                  color: "#fff",
                  overflowY: "auto",
                  backdropFilter: "blur(2px)",
                }}
              >
                <h6 className="mb-3">Comments and Activity</h6>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary mb-3"
                  placeholder="Write a comment..."
                />
                <div className="activity">
                  <p className="mb-0">
                    <strong>TestUser</strong> added this card <br />
                    <small className="text-secondary">just now</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CardModal;
