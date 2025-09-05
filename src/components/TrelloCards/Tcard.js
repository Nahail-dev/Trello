import React, { useState } from "react";
import "./Tcard.css";
import { Link } from "react-router-dom";

function Tcard() {
  // State to track multiple active tabs
  // Set 'board' as the default active tab
  const [activeTabs, setActiveTabs] = useState(["board"]); // default active tab is "board"

  const handleToggle = (tab) => {
    setActiveTabs(
      (prevTabs) =>
        prevTabs.includes(tab)
          ? prevTabs.filter((t) => t !== tab) // Remove if already active
          : [...prevTabs, tab] // Add if not active
    );
  };

  return (
    <div>
      <section className="trello-cards mt-2">
        <div className="container-fluid">
          <div className="cards-row">
            <div className="card-container">
              <div className="card-header d-flex justify-content-between">
                <Link to="/" className="text-decoration-none doing">
                  Doing
                </Link>
                <span className="horizontaldots">
                  <i
                    className="bx bx-dots-horizontal-rounded"
                    style={{ cursor: "pointer" }}
                  />
                </span>
              </div>

              <div className="card-body">
                {[1, 2, 3, 4].map((item, index) => (
                  <div className="card-image-container" key={`img-${index}`}>
                    <img
                      src="/im.jpeg"
                      className="card-image"
                      alt={`pexels-skitterphoto-${index}`}
                    />
                    <i className="bx bx-edit-alt edit-icon " />
                    <div className="image-description">
                      pexels-skitterphoto-9358.jpg
                    </div>
                  </div>
                ))}
                <div className="card-text-container" key="text-only">
                  <div className="card-text-item">
                    <p>This is a text-only card item</p>
                  </div>
                  <i className="bx bx-edit-alt edit-icon " />
                </div>
              </div>

              <div className="card-footer d-flex justify-content-between">
                <div className="addcard d-flex align-items-center">
                  <i className="bx bx-plus me-2" style={{ fontSize: 17 }} />
                  <span>Add a card</span>
                </div>
                <div className="copyicon">
                  <i className="bx bx-copy" />
                </div>
              </div>
            </div>

            {/* Second card */}
            <div className="cardtwo">
              <div className="d-flex justify-content-between mb-4">
                <p className="mb-0 title">Title</p>
                <i
                  className="bx bx-dots-horizontal threedots"
                  style={{ cursor: "pointer" }}
                />
              </div>
              <input
                type="text"
                className="card-inputtwo"
                placeholder="Enter list name"
              />
              <textarea
                className="card-inputthree textarea mb-1"
                placeholder="Enter list name or paste a link"
              />
              <div className="d-flex align-items-center">
                <button className="add-card-btntwo me-1">Add card</button>
                <i
                  className="bx bx-x"
                  style={{
                    fontSize: 31,
                    color: "#b6c2cf",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

            {/* Third + more */}
            {[1, 2, 3].map((item, index) => (
              <div className="cardthree" key={index}>
                <i className="bx bx-plus me-1" style={{ fontSize: 18 }} />
                <h5 className="mb-0" style={{ fontSize: 15 }}>
                  Add another list
                </h5>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
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
      </section>
    </div>
  );
}

export default Tcard;
