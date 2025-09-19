import React, { forwardRef, useState, useEffect } from "react";

const CardModal = forwardRef(({ title, listTitle, onClose, onUpdateTitle, listId, cardId }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title || "");

  // keep draft in sync when title prop changes
  useEffect(() => {
    setDraftTitle(title || "");
  }, [title]);

  // Load board background image from localStorage (robust)
  const [bgUrl, setBgUrl] = useState(null);
  useEffect(() => {
    const isLikelyImageUrl = (s) =>
      typeof s === "string" &&
      (s.startsWith("http://") ||
        s.startsWith("https://") ||
        s.startsWith("data:image") ||
        /(\.png|\.jpg|\.jpeg|\.webp|\.gif|\.bmp|\.svg)(\?.*)?$/i.test(s));

    const findUrlDeep = (obj, depth = 0) => {
      if (!obj || depth > 5) return null;
      if (typeof obj === "string") return isLikelyImageUrl(obj) ? obj : null;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const found = findUrlDeep(item, depth + 1);
          if (found) return found;
        }
        return null;
      }
      if (typeof obj === "object") {
        const candidateKeys = [
          "backgroundImage",
          "backgroundUrl",
          "background",
          "image",
          "cover",
          "boardImage",
          "bg",
          "url",
        ];
        // Direct candidates
        for (const key of candidateKeys) {
          const val = obj[key];
          const url = findUrlDeep(val, depth + 1);
          if (url) return url;
        }
        // Fallback: scan all keys
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          const url = findUrlDeep(val, depth + 1);
          if (url) return url;
        }
      }
      return null;
    };

    try {
      const raw = localStorage.getItem("boardData");
      if (!raw) {
        console.warn("CardModal: localStorage 'boardData' not found");
        return;
      }
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }
      const url = findUrlDeep(data);
      if (url) setBgUrl(url);
      else console.warn("CardModal: could not extract image URL from boardData", data);
    } catch (err) {
      console.warn("CardModal: error reading boardData", err);
    }
  }, []);

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
          padding: 20vh 20vw !important; /* default 20% margins */
        }
        /* Transparent inputs within the modal content */
        .card-modal-content input,
        .card-modal-content textarea,
        .card-modal-content .form-control {
          background-color: transparent !important;
          color: #ffffff !important;
          border: 1px solid rgba(255,255,255,0.25) !important;
          box-shadow: none !important;
        }
        /* Title input: no background, no box, only bottom border */
        .card-modal-content .card-title-input {
          background-color: transparent !important;
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
        .card-modal-content input:focus,
        .card-modal-content textarea:focus,
        .card-modal-content .form-control:focus {
          background-color: transparent !important;
          color: #ffffff !important;
          border-color: rgba(255,255,255,0.45) !important;
          box-shadow: none !important;
          outline: none !important;
        }
        .card-modal-content ::placeholder {
          color: rgba(255,255,255,0.65) !important;
          opacity: 1; /* Firefox */
        }
        @media (max-width: 1199px) {
          .card-modal-dialog { padding: 14vh 14vw !important; }
        }
        @media (max-width: 991px) {
          .card-modal-dialog { padding: 10vh 10vw !important; }
        }
        @media (max-width: 767px) {
          .card-modal-dialog { padding: 8vh 6vw !important; }
        }
        @media (max-width: 479px) {
          .card-modal-dialog { padding: 6vh 4vw !important; }
        }
        `}
      </style>
      <div className="modal-dialog card-modal-dialog">
        <div
          className="modal-content border-0 card-modal-content"
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
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
              backgroundColor: "rgba(15,17,20,0.7)",
              color: "#b6c2cf",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(6px)",
              padding: "0.9rem 1rem",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span
                className="badge"
                style={{
                  backgroundColor: "#22272b",
                  color: "#a6c5e2",
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
            className="modal-body d-flex p-0"
            style={{
              flex: 1,
              overflow: "hidden",
              background: bgUrl
                ? `linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("${bgUrl}") center/cover no-repeat`
                : "linear-gradient(180deg,#171a20, #12151a)",
            }}
          >
            {/* LEFT SIDE */}
            <div
              className="flex-grow-1 p-4"
              style={{
                backgroundColor: "rgba(0,0,0,0.30)",
                color: "#fff",
                overflowY: "auto",
                backdropFilter: "blur(2px)",
              }}
            >
              {/* Card Name row with background */}
              <div
                className="d-flex align-items-center justify-content-between mt-2"
                style={{
                  background: "#0f1114",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  gap: 12,
                }}
              >
                {!isEditing ? (
                  <>
                    <h3 className="fw-bold mb-0" style={{ color: "#d6e0ea", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {title}
                    </h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
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
                        if (e.key === 'Enter') commitEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-primary" onClick={commitEdit}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
              {/* From which list */}
              <div style={{ color: "#8b9aa7", fontSize: 13 }}>
                In list: <strong style={{ color: "#a6c5e2" }}>{listTitle || "Untitled List"}</strong>
              </div>

              {/* Description Section */}
              <div className="mt-4">
                <h6 className="text-light">Description</h6>
                <textarea
                  className="form-control bg-dark text-light border-secondary mt-2"
                  placeholder="Add a more detailed description..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div
              className="p-4 border-start"
              style={{
                width: "320px",
                backgroundColor: "rgba(0,0,0,0.35)",
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
                  <strong>Nahail Ahmad</strong> added this card <br />
                  <small className="text-muted">just now</small>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="modal-footer border-0"
            style={{
              backgroundColor: "rgba(15,17,20,0.7)",
              backdropFilter: "blur(6px)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CardModal;
