import { useDroppable } from "@dnd-kit/core";

export default function Droppable({ id, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%", // Make sure it covers parent area
      }}
    >
      {children}
      {/* Invisible drop area that takes no space */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
