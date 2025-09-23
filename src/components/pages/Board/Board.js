import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdvSearchNav from "../../advSearchNav/AdvSearchNav";
import CardBoard from "../../cardBoard/CardBoard";

import "./Board.css";
import {
  createWorkspace,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  getProjects,
  addProjects,
  deleteProjects,
} from "../../../api/auth";
import { toast } from "react-toastify";

function Board() {
  const [workspaces, setWorkspaces] = useState([]);

  const images = [
    "/assets/images/i1.jpg",
    "/assets/images/i2.jpg",
    "/assets/images/i3.jpg",
    "/assets/images/i4.jpg",
  ];

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [boardsByWorkspace, setBoardsByWorkspace] = useState({});
  const [workspacePrivacy, setWorkspacePrivacy] = useState("private");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrivacy, setEditPrivacy] = useState("private");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeDropdownWsId, setActiveDropdownWsId] = useState(null);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState({});
  const [boardsError, setBoardsError] = useState({});
  const [boardTitles, setBoardTitles] = useState({});
  const [visibilities, setVisibilities] = useState({});

  const navigate = useNavigate();

  const handleCreateBoard = async (workspaceId, boardData) => {
    try {
      const response = await addProjects({
        ...boardData,
        workspace_id: workspaceId,
      });

      const createdBoard = response.data.data;

      if (createdBoard?.id) {
        const formattedBoardName = encodeURIComponent(
          createdBoard.project_title
        );

        // Save board data in localStorage
        localStorage.setItem(
          "boardData",
          JSON.stringify({
            background_type: createdBoard.background_type,
            background_details: createdBoard.background_details,
          })
        );
        navigate(`/dashboard/${workspaceId}/${formattedBoardName}`);
      }

      toast.success("Board created successfully ✅");
    } catch (error) {
      console.error("Error creating board:", error);
      toast.error("Failed to create board ❌");
    }
  };

  const handleDeleteBoard = async (_workspaceId, projectId) => {
    try {
      await deleteProjects(projectId);
      toast.success("Board deleted successfully!");
      // Optionally refresh the list
      fetchWorkspaces();
    } catch (error) {
      console.error("Error deleting board:", error);
      toast.error("Failed to delete board.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchWorkspaces();
    };
    fetchData();
  }, []);

  const fetchWorkspaces = async () => {
    setFetching(true);
    try {
      const resp = await getWorkspaces();
      const fetchedWorkspaces = resp?.data?.data || [];
      setWorkspaces(fetchedWorkspaces);
      setError("");

      const boardsData = {};
      const boardsErrs = {}; // collect errors for workspaces

      for (const ws of fetchedWorkspaces) {
        try {
          const boardResp = await getProjects(ws.id);
          boardsData[ws.id] = boardResp?.data?.data || [];
        } catch (err) {
          const status = err?.response?.status;

          if (status === 404) {
            // API says "not found" — treat as no boards (do NOT set an error)
            boardsData[ws.id] = [];
          } else {
            // Real error (network, 5xx, etc.) — store it so the UI can show it only for this workspace
            console.error(`Error fetching boards for workspace ${ws.id}`, err);
            boardsData[ws.id] = [];
            boardsErrs[ws.id] =
              err?.response?.data?.message ||
              err.message ||
              "Failed to load boards";
          }
        }
      }

      setBoardsByWorkspace(boardsData);
      setBoardsError(boardsErrs);
    } catch (err) {
      console.error("Failed to fetch workspaces", err);
      setError("We couldn’t load your workspaces. Please try again later.");
      // optionally clear boards state
      setBoardsByWorkspace({});
      setBoardsError({});
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      await deleteWorkspace(id);
      setWorkspaces((prev) => prev.filter((b) => b.id !== id));

      toast.success("Workspace deleted successfully 🗑️");
    } catch (error) {
      toast.error("Failed to delete workspace ❌");
    }
  };

  const handleBoardClick = (workspaceId, board) => {
    if (!board) return;

    const formattedBoardName = encodeURIComponent(board.project_title);

    // Save board data in localStorage
    localStorage.setItem(
      "boardData",
      JSON.stringify({
        background_type: board.background_type,
        background_details: board.background_details,
      })
    );

    navigate(`/dashboard/${workspaceId}/${formattedBoardName}`);
  };

  const openEditModal = (board) => {
    setEditId(board.id);
    setEditName(board.project_title);
    setEditPrivacy(board.privacy || "private");
    setShowEditModal(true);
  };

  const handleUpdateWorkspace = async () => {
    if (!editName) return toast.warning("Workspace name cannot be empty ⚠️");

    try {
      const payload = { name: editName, privacy: editPrivacy };
      const response = await updateWorkspace(editId, payload);
      const updatedWorkspace = response.data.data;

      // update all workspaces
      setWorkspaces((prev) =>
        prev.map((board) =>
          board.id === editId ? { ...board, ...updatedWorkspace } : board
        )
      );

      setShowEditModal(false);
      setEditId(null);
      setEditName("");
      toast.success("Workspace updated ✅");
    } catch (error) {}
  };

  const handleCreateWorkspace = async () => {
    if (!workspaceName) return toast.warning("Please enter workspace name");
    setLoading(true);

    try {
      const payload = { name: workspaceName, privacy: workspacePrivacy };
      await createWorkspace(payload);

      const response = await getWorkspaces();
      const allWorkspaces = response.data?.data || [];
      setWorkspaces(allWorkspaces);

      setShowModal(false);
      setWorkspaceName("");
      setWorkspacePrivacy("private");

      toast.success("Workspace created ✅");
    } catch (error) {
      toast.error("Failed to create workspace ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdvSearchNav />

      <div className="container mt-5">
        <div className="row">
          {/* Recently Viewed */}
          <div className="mb-4">
            <div className="header-with-icon mb-2">
              <span className="bi bi-clock fs-4 me-2"></span>
              <h4 className=" mb-0 ">Recently Viewed Boards</h4>
            </div>
            {/* {recentBoards.length ? (
                <div className="d-flex flex-wrap gap-3 mb-4">
                  {recentBoards.map((board) => (
                    <CardBoard
                      key={board.id}
                      board={board}
                      onEdit={() => openEditModal(board)}
                      onDelete={() => {
                        setDeleteId(board.id);
                        setDeleteName(board.name);
                      }}
                      onClick={() => handleBoardClick(board)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-secondary mb-4">No recently viewed boards</p>
              )} */}
          </div>

          {/* Your Workspaces */}
          <div className="mb-4">
            <div className="header-with-icon mb-2 d-flex align-items-center justify-content-between ">
              <div className="gap-2 d-flex align-items-center mb-2">
                <span className="bi bi-folder fs-4 "></span>
                <h4 className="header-with-icon d-inline">Your Workspaces</h4>
              </div>

              {/* Add New Workspace Button */}
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-lg me-1"></i> New Workspace
              </button>
            </div>

            {fetching ? (
              <div className="d-flex justify-content-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <p className="text-danger text-center my-4">{error}</p>
            ) : (
              <div className="workspace-list ">
                {workspaces.map((ws) => (
                  <div key={ws.id} className="mb-4">
                    {/* === Workspace Header === */}
                    <div className="d-flex align-items-center justify-content-between mb-2 border-bottom border-1">
                      <h5 className="fw-bold d-flex align-items-center gap-1 workspace-title">
                        {ws.name}
                        <span className="badge workspace-badge">
                          {ws.privacy}
                        </span>
                      </h5>

                      <div className="workspace-actions d-flex align-items-center ms-2">
                        <button
                          className="me-3 workspace-btn"
                          title="Edit Workspace"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(ws);
                          }}
                        >
                          <span className="bi bi-pencil-fill"></span>Edit
                        </button>
                        <button
                          className="workspace-btn"
                          title="Delete Workspace"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(ws.id);
                            setDeleteName(ws.name);
                            setShowDeleteModal(true);
                          }}
                        >
                          <span className="bi bi-trash-fill"></span>Delete
                        </button>
                      </div>
                    </div>

                    {/* === Boards or Error Section === */}
                    <div className="d-flex flex-wrap gap-3 mt-3 justify-content-center justify-content-md-start">
                      {/* --- Show Error for this Workspace --- */}
                      {boardsError[ws.id] && (
                        <p className="text-danger">{boardsError[ws.id]}</p>
                      )}

                      {/* --- Boards Display --- */}
                      {boardsByWorkspace[ws.id]?.length > 0 &&
                        boardsByWorkspace[ws.id].map((board) => (
                          <CardBoard
                            key={board.id}
                            title={board.project_title}
                            variant={board.background_type}
                            background={board.background_details}
                            onClick={() => handleBoardClick(ws.id, board)}
                            onDelete={() => handleDeleteBoard(ws.id, board.id)} // ✅ include ws.id for uniqueness
                          />
                        ))}

                      {/* --- Add Board Card --- */}
                      <CardBoard
                        title="Add Board"
                        variant="add"
                        onClick={() =>
                          setActiveDropdownWsId(
                            activeDropdownWsId === ws.id ? null : ws.id
                          )
                        }
                      />

                      {/* --- Add Board Dropdown --- */}
                      {activeDropdownWsId === ws.id && (
                        <div className="add-board-dropdown text-center rounded-4 p-3">
                          <div className="add-board-header d-flex align-items-center justify-content-between mb-3">
                            <h5 className="text-center mb-0">Create Board</h5>
                            <span
                              className="bx bx-x"
                              role="button"
                              onClick={() => setActiveDropdownWsId(null)}
                            />
                          </div>

                          {/* === Background Selection === */}
                          <div className="text-start">
                            <label className="fw-semibold mb-2">
                              Background
                            </label>

                            {/* --- Image Background Options --- */}
                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {images.map((image, index) => {
                                const isSelected =
                                  selectedBackgrounds[ws.id]?.type ===
                                    "image" &&
                                  selectedBackgrounds[ws.id]?.details === image;

                                return (
                                  <div
                                    key={index}
                                    className={`bg-option position-relative ${
                                      isSelected
                                        ? "border-primary border-3"
                                        : ""
                                    }`}
                                    style={{
                                      backgroundImage: `url(${image})`,
                                      width: "60px",
                                      height: "40px",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      setSelectedBackgrounds((prev) => ({
                                        ...prev,
                                        [ws.id]: {
                                          type: "image",
                                          details: image,
                                        },
                                      }))
                                    }
                                  >
                                    {isSelected && (
                                      <i className="bi bi-check-circle-fill text-primary position-absolute top-0 end-0 me-1 mt-1"></i>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* --- Gradient Background Options --- */}
                            <div className="d-flex gap-2 mb-3 flex-wrap">
                              {[
                                "linear-gradient(45deg, #ff9a9e, #fad0c4)",
                                "linear-gradient(45deg, #a1c4fd, #c2e9fb)",
                                "linear-gradient(45deg, #fbc2eb, #a6c1ee)",
                                "linear-gradient(45deg, #84fab0, #8fd3f4)",
                                "linear-gradient(45deg, #fccb90, #d57eeb)",
                              ].map((gradient, index) => {
                                const isSelected =
                                  selectedBackgrounds[ws.id]?.type ===
                                    "gradient" &&
                                  selectedBackgrounds[ws.id]?.details ===
                                    gradient;

                                return (
                                  <div
                                    key={index}
                                    className={`bg-option position-relative ${
                                      isSelected
                                        ? "border-primary border-3"
                                        : ""
                                    }`}
                                    style={{
                                      background: gradient,
                                      width: "45px",
                                      height: "30px",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      setSelectedBackgrounds((prev) => ({
                                        ...prev,
                                        [ws.id]: {
                                          type: "gradient",
                                          details: gradient,
                                        },
                                      }))
                                    }
                                  >
                                    {isSelected && (
                                      <i className="bi bi-check-circle-fill text-primary position-absolute top-0 end-0 me-1 mt-1"></i>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* --- Board Title Input --- */}
                            <div className="text-start d-flex flex-column mt-2">
                              <label>Board title</label>
                              <input
                                type="text"
                                name={`board_title_${ws.id}`}
                                placeholder="Enter board title"
                                className="form-control"
                                value={boardTitles[ws.id] || ""}
                                onChange={(e) =>
                                  setBoardTitles((prev) => ({
                                    ...prev,
                                    [ws.id]: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            {/* --- Visibility Select --- */}
                            <div className="text-start d-flex flex-column mt-3">
                              <label>Visibility</label>
                              <div className="dropup w-100">
                                <button
                                  className="btn btn-dark dropdown-toggle w-100 d-flex align-items-center text-start"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="bi bi-eye fs-5 me-2"></i>
                                  <span className="flex-grow-1">
                                    {visibilities[ws.id] || "Select visibility"}
                                  </span>
                                </button>

                                <ul className="dropdown-menu w-100">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      type="button"
                                      onClick={() =>
                                        setVisibilities((prev) => ({
                                          ...prev,
                                          [ws.id]: "private",
                                        }))
                                      }
                                    >
                                      <div className="d-flex align-items-center">
                                        <i className="bi bi-lock fs-5 me-2"></i>
                                        <div>
                                          <p className="mb-0">Private</p>
                                          <small>
                                            Only workspace members can see this
                                            board
                                          </small>
                                        </div>
                                      </div>
                                    </button>
                                  </li>

                                  <li>
                                    <button
                                      className="dropdown-item"
                                      type="button"
                                      onClick={() =>
                                        setVisibilities((prev) => ({
                                          ...prev,
                                          [ws.id]: "public",
                                        }))
                                      }
                                    >
                                      <div className="d-flex align-items-center">
                                        <i className="bi bi-globe fs-5 me-2"></i>
                                        <div>
                                          <p className="mb-0">Public</p>
                                          <small>
                                            Anyone with the link can see this
                                            board
                                          </small>
                                        </div>
                                      </div>
                                    </button>
                                  </li>

                                  <li>
                                    <button
                                      className="dropdown-item"
                                      type="button"
                                      onClick={() =>
                                        setVisibilities((prev) => ({
                                          ...prev,
                                          [ws.id]: "guest",
                                        }))
                                      }
                                    >
                                      <div className="d-flex align-items-center">
                                        <i className="bi bi-person fs-5 me-2"></i>
                                        <div>
                                          <p className="mb-0">Guest</p>
                                          <small>
                                            Guests can view with invite
                                          </small>
                                        </div>
                                      </div>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {/* --- Create Button --- */}
                            <div className="mt-3">
                              <button
                                className="btn btn-primary w-100"
                                onClick={() =>
                                  handleCreateBoard(ws.id, {
                                    project_title: boardTitles[ws.id],
                                    background_type:
                                      selectedBackgrounds[ws.id]?.type || "",
                                    background_details:
                                      selectedBackgrounds[ws.id]?.details || "",
                                    visibility:
                                      visibilities[ws.id] || "private",
                                  })
                                }
                              >
                                Create
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guest Workspaces */}
          <div className="mb-4">
            <div className="header-with-icon mb-2">
              <span className="bi bi-person fs-4 me-2"></span>
              <h4 className="header-with-icon mb-0">Guest Workspace</h4>
            </div>
            {workspaces.filter((b) => b.type === "guest").length ? (
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                {workspaces
                  .filter((b) => b.type === "guest")
                  .map((board) => (
                    <CardBoard
                      key={board.id}
                      board={board}
                      onEdit={() => openEditModal(board)}
                      onDelete={() => {
                        setDeleteId(board.id);
                        setDeleteName(board.name);
                      }}
                      onClick={() => handleBoardClick(board)}
                      icon="bi-person-circle"
                    />
                  ))}
              </div>
            ) : (
              <p className="text-secondary mb-4">No guest workspaces</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals (Create/Edit) */}
      {showModal && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-secondary">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>Create Link New
                  Workspace
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-pencil me-2"></i>Name
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-secondary"
                    style={{ color: "#9fadbc" }}
                    placeholder="Enter workspace name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-lock me-2"></i>Privacy
                  </label>
                  <select
                    className="form-select bg-dark border border-secondary text-secondary"
                    style={{ color: "#9fadbc" }}
                    value={workspacePrivacy}
                    onChange={(e) => setWorkspacePrivacy(e.target.value)}
                  >
                    <option value="private">
                      Private - Only invited members can see
                    </option>
                    <option value="public">
                      Public - Anyone with the link can view
                    </option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateWorkspace}
                  disabled={!workspaceName || loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  )}
                  Create Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-secondary">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>Edit Workspace
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-pencil me-2"></i>Name
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-secondary"
                    style={{ color: "#9fadbc" }}
                    value={editName || ""}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-lock me-2"></i>Privacy
                  </label>
                  <select
                    className="form-select bg-dark text-secondary"
                    style={{ color: "#9fadbc" }}
                    value={editPrivacy || "private"}
                    onChange={(e) => setEditPrivacy(e.target.value)}
                  >
                    <option value="private">
                      Private - Only invited members can see
                    </option>
                    <option value="public">
                      Public - Anyone with the link can view
                    </option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateWorkspace}
                  disabled={!editName}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Workspace Modal */}
      {showDeleteModal && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "#bfc1c4" }}>
                  Delete Workspace
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ color: "#bfc1c4" }}>
                Are you sure you want to delete{" "}
                <strong className="text-danger">{deleteName}</strong>? <br />
                This action cannot be undone.
              </div>
              <div className="modal-footer" style={{ color: "#bfc1c4" }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={async () => {
                    if (!deleteId) return toast.error("Workspace not selected");
                    await handleDeleteWorkspace(deleteId);
                    setDeleteId(null);
                    setDeleteName("");
                    setShowDeleteModal(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Board;
