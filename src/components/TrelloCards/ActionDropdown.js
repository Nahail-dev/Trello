import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ActionDropdown = ({
  variant,
  button,
  labels = [],
  members = [],
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(); // wrapper ref
  const triggerRef = useRef();
  const panelRef = useRef();
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 220,
    maxHeight: 280,
  });
  // Labels UI state
  const [labelQuery, setLabelQuery] = useState("");
  const [labelSelectedIds, setLabelSelectedIds] = useState([]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      const withinWrapper = ref.current && ref.current.contains(e.target);
      const withinPanel =
        panelRef.current && panelRef.current.contains(e.target);
      if (!withinWrapper && !withinPanel) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Position dropdown relative to trigger (viewport coords)
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const margin = 6;
      const width = 240;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left = Math.min(r.left, vw - width - margin);
      left = Math.max(margin, left);
      let top = r.bottom + margin;
      const maxHeight = Math.max(160, vh - top - margin);
      setPos({ top, left, width, maxHeight });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  // Variant-based bodies (no headings; a common header is rendered above)
  const renderers = {
    add: () => {
      const options = [
        {
          key: "labels",
          icon: "bi-tag",
          title: "Labels",
          subtitle: "Organize, categorize, and prioritize",
        },
        {
          key: "dates",
          icon: "bi-clock",
          title: "Dates",
          subtitle: "Start dates, due dates, and reminders",
        },
        {
          key: "checklist",
          icon: "bi-check2-square",
          title: "Checklist",
          subtitle: "Add subtasks",
        },
        {
          key: "members",
          icon: "bi-people",
          title: "Members",
          subtitle: "Assign members",
        },
        {
          key: "attachment",
          icon: "bi-paperclip",
          title: "Attachment",
          subtitle: "Attach links, pages, work items, and more",
        },
      ];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className="btn w-100 d-flex align-items-center add-option-btn"
              onClick={() => {
                onSelect?.(opt.key);
                setOpen(false);
              }}
              style={{
                color: "#9fadbc",
                borderRadius: 10,
                padding: "10px 12px",
                textAlign: "start",
                backgroundColor: "transparent", // no background by default
              }}
            >
              <span
                className="d-inline-flex align-items-center justify-content-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  marginRight: 12,
                  color: "#9fadbc",
                }}
              >
                <i className={`bi ${opt.icon}`} />
              </span>
              <span style={{ lineHeight: 1.2 }}>
                <div style={{ color: "#9fadbc", fontWeight: 600 }}>
                  {opt.title}
                </div>
                <div style={{ color: "#9fadbc", fontSize: 12 }}>
                  {opt.subtitle}
                </div>
              </span>
            </button>
          ))}
          {/* Hover effect only */}
          <style>
            {`
                .add-option-btn:hover {
                  background-color: rgba(255, 255, 255, 0.05) !important;
                }
              `}
          </style>
        </div>
      );
    },

    labels: () => {
      const filtered = labels.filter((l) =>
        (l.name || "").toLowerCase().includes(labelQuery.toLowerCase())
      );
      const toggleSel = (id) => {
        setLabelSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
        const lbl = labels.find((x) => x.id === id);
        onSelect?.("label", lbl);
      };
      return (
        <div className="px-4">
          {/* Search */}
          <input
            type="text"
            value={labelQuery}
            onChange={(e) => setLabelQuery(e.target.value)}
            placeholder="Search labels..."
            className="form-control"
            style={{
              color: "#9fadbc",
              border: "2px solid #3a6ea8",
              borderRadius: 8,
              boxShadow: "none",
              marginBottom: 10,
            }}
          />

          <div style={{ color: "#9fadbc", fontSize: 13, marginBottom: 6 }}>
            Labels
          </div>

          {/* Labels list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((label) => {
              const checked = labelSelectedIds.includes(label.id);
              return (
                <div
                  key={label.id}
                  className="d-flex align-items-center"
                  style={{ gap: 10 }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSel(label.id)}
                    style={{ width: 18, height: 18, cursor: "pointer", }}
                  />

                  {/* Color pill */}
                  <div
                    onClick={() => toggleSel(label.id)}
                    style={{
                      backgroundColor: label.color,
                      height: 36,
                      borderRadius: 8,
                      flex: 1,
                      cursor: "pointer",
                    }}
                    title={label.name}
                  />

                  {/* Edit icon */}
                  <button
                    type="button"
                    className="btn btn-sm"
                    title="Edit label"
                    onClick={() => onSelect?.("edit_label", label)}
                    style={{
                      background: "transparent",
                      color: "#9fadbc",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    <i className="bi bi-pencil" />
                  </button>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-muted" style={{ fontSize: 13 }}>
                No labels match your search
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              className="btn w-100"
              onClick={() => onSelect?.("create_label")}
              style={{
                color: "#9fadbc",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "10px 12px",
                marginBottom: 10,
              }}
            >
              Create a new label
            </button>
          </div>
        </div>
      );
    },

    dates: () => (
      <>
        <p className="text-muted small">Set a due date</p>
        <button
          className="btn btn-sm btn-primary w-100"
          onClick={() => {
            onSelect?.("date", new Date());
            setOpen(false);
          }}
        >
          Set Today
        </button>
      </>
    ),

    checklist: () => (
      <>
        <button
          className="btn btn-sm btn-outline-light w-100"
          onClick={() => {
            onSelect?.("checklist", "New Item");
            setOpen(false);
          }}
        >
          + Add Checklist Item
        </button>
      </>
    ),

    members: () => (
      <>
        {members.length > 0 ? (
          <ul className="list-unstyled mb-0">
            {members.map((m) => (
              <li key={m.id} className="mb-1">
                <button
                  className="btn btn-sm w-100 text-start"
                  style={{
                    backgroundColor: "#1a1d21",
                    color: "#9fadbc",
                    borderRadius: "6px",
                  }}
                  onClick={() => {
                    onSelect?.("member", m);
                    setOpen(false);
                  }}
                >
                  {m.name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted small">No members found</p>
        )}
      </>
    ),
  };

  const getTitle = () => {
    switch (variant) {
      case "add":
        return "Add to card";
      case "labels":
        return "Labels";
      case "dates":
        return "Dates";
      case "checklist":
        return "Checklist";
      case "members":
        return "Members";
      default:
        return "Actions";
    }
  };

  return (
    <div
      ref={ref}
      className="dropdown-wrapper position-relative d-inline-block"
    >
      {/* Trigger Button */}
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
      >
        {button}
      </div>

      {/* Dropdown Panel */}
      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="dropdown-menu show"
            style={{
              minWidth: variant === "labels" ? 331 : pos.width,
              maxHeight: pos.maxHeight,
              overflowY: "auto",
              backgroundColor: "#12151a !important",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              zIndex: 3000,
              position: "fixed",
              top: pos.top,
              left: pos.left,
              color: "#9fadbc",
            }}
          >
            {/* Common header */}
            <div
              className="d-flex align-items-center justify-content-center position-relative mb-2 pb-2"
              style={{ borderBottom: "none" }}
            >
              <div
                className="fw-semibold"
                style={{ textAlign: "center", color: "#9fadbc" }}
              >
                {getTitle()}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="btn btn-sm position-absolute end-0 top-0 mt-1 me-1"
                style={{
                  backgroundColor: "transparent",
                  color: "#9fadbc",
                  border: "none",
                  borderRadius: 12,
                  padding: "2px 8px",
                  lineHeight: 1,
                  boxShadow: "none",
                }}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            {(
              renderers[variant] ||
              (() => <p className="text-muted small">No content</p>)
            )()}
          </div>,
          document.body
        )}
    </div>
  );
};

export default ActionDropdown;
