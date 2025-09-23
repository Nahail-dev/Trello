"use client";
import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import Droppable from "./Droppable";
import SortableCard from "./SortableCard";
import "./Tcard.css";
import { Link } from "react-router-dom";
import CardModal from "./CardModal";

function Tcard() {
  const [lists, setLists] = useState([]);
  const [showListInput, setShowListInput] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [activeListId, setActiveListId] = useState(null);

  const [cardInput, setCardInput] = useState(""); // For text or link input
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(null);

  const [activeTabs, setActiveTabs] = useState(["board"]);
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // require slight movement to start drag, so simple clicks open modal
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCard, setModalCard] = useState(null);
  const modalRef = useRef(null);

  const openModal = (card) => {
    setModalCard(card);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // allow fade-out before clearing content, optional
    setTimeout(() => setModalCard(null), 200);
  };

  // Manage Bootstrap-like modal classes manually (no Bootstrap JS dependency)
  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    const addBackdrop = () => {
      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.setAttribute("data-generated", "true");
      document.body.appendChild(backdrop);
    };

    const removeBackdrop = () => {
      const backdrop = document.querySelector(
        '.modal-backdrop[data-generated="true"]'
      );
      if (backdrop) backdrop.remove();
    };

    if (modalOpen) {
      modalEl.style.display = "block";
      modalEl.classList.add("show");
      modalEl.removeAttribute("aria-hidden");
      document.body.classList.add("modal-open");
      addBackdrop();
    } else {
      modalEl.classList.remove("show");
      modalEl.setAttribute("aria-hidden", "true");
      modalEl.style.display = "none";
      document.body.classList.remove("modal-open");
      removeBackdrop();
    }

    return () => {
      // Cleanup on unmount
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(
        '.modal-backdrop[data-generated="true"]'
      );
      if (backdrop) backdrop.remove();
    };
  }, [modalOpen]);

  // Update a card's title (used by modal)
  const handleUpdateCardTitle = (listId, cardId, newTitle) => {
    if (!newTitle || !listId || !cardId) return;
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((c) =>
                c.id === cardId ? { ...c, title: newTitle } : c
              ),
            }
          : list
      )
    );
    // Keep modal state in sync so it reflects the new title immediately
    setModalCard((prev) => (prev ? { ...prev, title: newTitle } : prev));
  };

  /** Toggle nav tabs */
  const handleToggle = (tab) => {
    setActiveTabs((prevTabs) =>
      prevTabs.includes(tab)
        ? prevTabs.filter((t) => t !== tab)
        : [...prevTabs, tab]
    );
  };

  /** Add new list */
  const handleAddList = () => {
    if (!newListName.trim()) return;

    setLists([
      ...lists,
      { id: Date.now().toString(), title: newListName, cards: [] },
    ]);
    setNewListName("");
    setShowListInput(false);
  };

  /** Detect card type */
  const detectCardType = (value) => {
    if (imagePreview) return "image";
    if (value.startsWith("http://") || value.startsWith("https://"))
      return "link";
    return "text";
  };

  /** Handle image drag and drop */
  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  /** Add card to list */
  const handleAddCard = (listId) => {
    if (!cardInput.trim() && !imagePreview) return;

    const type = detectCardType(cardInput);

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  id: Date.now().toString(),
                  title: type === "image" ? imagePreview : cardInput,
                  type,
                  imageName: type === "image" ? imageName : null,
                },
              ],
            }
          : list
      )
    );

    // Reset
    setCardInput("");
    setImagePreview(null);
    setImageName(null);
    setActiveListId(null);
  };

  /** Handle drag end logic */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !active) return;

    const [sourceListId, sourceCardId] = String(active.id).split(":");
    const [destListId] = String(over.id).split(":");

    setLists((prev) => {
      const newLists = [...prev];

      const sourceListIndex = newLists.findIndex((l) => l.id === sourceListId);
      const destListIndex = newLists.findIndex((l) => l.id === destListId);

      if (sourceListIndex === -1 || destListIndex === -1) return prev;

      const sourceCards = [...newLists[sourceListIndex].cards];
      const cardToMoveIndex = sourceCards.findIndex(
        (c) => c.id === sourceCardId
      );

      if (cardToMoveIndex === -1) return prev;

      const movedCard = sourceCards[cardToMoveIndex];

      if (sourceListId === destListId) {
        let targetIndex =
          over.data.current?.sortable?.index ?? sourceCards.length - 1;
        if (targetIndex !== cardToMoveIndex) {
          sourceCards.splice(cardToMoveIndex, 1);
          sourceCards.splice(targetIndex, 0, movedCard);
        }
        newLists[sourceListIndex].cards = sourceCards;
      } else {
        const destCards = [...newLists[destListIndex].cards];
        sourceCards.splice(cardToMoveIndex, 1);
        destCards.push(movedCard);
        newLists[sourceListIndex].cards = sourceCards;
        newLists[destListIndex].cards = destCards;
      }

      return newLists;
    });
  };

  return (
    <div>
      <section className="trello-cards">
        <div className="container-fluid">
          <div className="cards-row">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={({ active }) => {
                const [listId, cardId] = String(active.id).split(":");
                const list = lists.find((l) => l.id === listId);
                const card = list?.cards.find((c) => c.id === cardId);
                if (card) setActiveCard({ ...card, listId });
              }}
              onDragCancel={() => setActiveCard(null)}
              onDragEnd={(e) => {
                handleDragEnd(e);
                setActiveCard(null);
              }}
            >
              {lists.map((list) => (
                <div className="card-container" key={list.id}>
                  <div className="card-header d-flex justify-content-between">
                    <p className="list-title my-auto">{list.title}</p>
                    <span className="horizontaldots">
                      <i className="bx bx-dots-horizontal-rounded" />
                    </span>
                  </div>

                  <SortableContext
                    items={list.cards.map((card) => `${list.id}:${card.id}`)}
                    strategy={rectSortingStrategy}
                  >
                    <Droppable id={`${list.id}:dropzone`}>
                      <div
                        className={
                          list.cards.length > 0 ? "card-body" : "empty-list"
                        }
                      >
                        {list.cards.map((card) => (
                          <SortableCard
                            key={`${list.id}:${card.id}`}
                            id={`${list.id}:${card.id}`}
                            title={card.title}
                            onClick={() =>
                              openModal({
                                ...card,
                                listId: list.id,
                                listTitle: list.title,
                              })
                            }
                            type={card.type}
                            imageName={card.imageName}
                          />
                        ))}
                      </div>
                    </Droppable>
                  </SortableContext>

                  {/* Add Card Section */}
                  <div
                    className="card-footer d-flex justify-content-between"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleImageDrop}
                  >
                    {activeListId === list.id ? (
                      <div className="w-100">
                        {!imagePreview ? (
                          <input
                            type="text"
                            className="card-inputtwo"
                            placeholder="Enter text or paste link, or drag image here"
                            value={cardInput}
                            onChange={(e) => setCardInput(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100px",
                                borderRadius: "4px",
                              }}
                            />
                            <p style={{ fontSize: "12px", marginTop: "5px" }}>
                              {imageName}
                            </p>
                          </div>
                        )}
                        <div className="d-flex justify-content-between mt-2">
                          <button
                            className="add-card-btntwo me-1"
                            onClick={() => handleAddCard(list.id)}
                          >
                            Add Card
                          </button>
                          <i
                            className="bx bx-x close-icon my-auto fs-4 horizontaldots"
                            onClick={() => {
                              setCardInput("");
                              setImagePreview(null);
                              setImageName(null);
                              setActiveListId(null);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="addcard w-100"
                        onClick={() => setActiveListId(list.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          className="bx bx-plus me-2"
                          style={{ fontSize: 17 }}
                        />
                        <span>Add a card</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <DragOverlay>
                {activeCard && (
                  <SortableCard
                    id={activeCard.id}
                    title={activeCard.title}
                    type={activeCard.type}
                    imageName={activeCard.imageName}
                  />
                )}
              </DragOverlay>
            </DndContext>

            {/* Add List Section */}
            {showListInput ? (
              <div className="cardtwo">
                <input
                  type="text"
                  className="card-inputtwo"
                  placeholder="Enter list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  autoFocus
                />
                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="add-card-btntwo me-1"
                    onClick={handleAddList}
                  >
                    Add list
                  </button>
                  <i
                    className="bx bx-x"
                    style={{
                      fontSize: 31,
                      color: "#b6c2cf",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setShowListInput(false);
                      setNewListName("");
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                className="cardthree d-flex align-items-center"
                onClick={() => setShowListInput(true)}
              >
                <i className="bx bx-plus me-1" style={{ fontSize: 18 }} />
                <h5 className="mb-0" style={{ fontSize: 15 }}>
                  {lists.length === 0 ? "Add list" : "Add another list"}
                </h5>
              </div>
            )}
          </div>
        </div>
        <div className="trello-nav-tabs">
          <ul className="nav custom-tabs">
            <li className="nav-item">
              <Link
                to="#"
                className={`nav-link ${
                  activeTabs.includes("inbox") ? "active" : ""
                }`}
                onClick={() => handleToggle("inbox")}
              >
                <i
                  className={`bi bi-envelope nav-icon ${
                    activeTabs.includes("inbox")
                      ? "border-right border-primary"
                      : ""
                  }`}
                />{" "}
                Inbox
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="#"
                className={`nav-link ${
                  activeTabs.includes("planner") ? "active" : ""
                }`}
                onClick={() => handleToggle("planner")}
              >
                <i
                  className={`bi bi-calendar nav-icon ${
                    activeTabs.includes("planner")
                      ? "border-right border-primary"
                      : ""
                  }`}
                />{" "}
                Planner
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="#"
                className={`nav-link ${
                  activeTabs.includes("board") ? "active" : ""
                }`}
                onClick={() => handleToggle("board")}
              >
                <i
                  className={`bi bi-kanban nav-icon ${
                    activeTabs.includes("board")
                      ? "border-right border-primary"
                      : ""
                  }`}
                />{" "}
                Board
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="#"
                className={`nav-link ${
                  activeTabs.includes("switchBoards") ? "active" : ""
                }`}
                onClick={() => handleToggle("switchBoards")}
              >
                <i
                  className={`bi bi-columns-gap nav-icon ${
                    activeTabs.includes("switchBoards")
                      ? "border-right border-primary"
                      : ""
                  }`}
                />{" "}
                Switch Boards
              </Link>
            </li>
          </ul>
        </div>
      </section>
      {/* Card Modal */}
      <CardModal
        ref={modalRef}
        title={modalCard?.title || ""}
        listTitle={modalCard?.listTitle || ""}
        listId={modalCard?.listId || ""}
        cardId={modalCard?.id || ""}
        onUpdateTitle={handleUpdateCardTitle}
        onClose={closeModal}
      />
    </div>
  );
}

export default Tcard;
