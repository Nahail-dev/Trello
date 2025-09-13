import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdvSearchNav from "../../advSearchNav/AdvSearchNav";
import CardBoard from "../../cardBoard/CardBoard";
import img from "../../../assets/images/i1.jpg";
import "./Board.css";
import {
  createWorkspace,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
} from "../../../api/auth";
import { toast } from "react-toastify";

function Board() {
  const [boards, setBoards] = useState([]);
  const [recentBoards, setRecentBoards] = useState(() => {
    const saved = localStorage.getItem("recentWorkspaces");
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspacePrivacy, setWorkspacePrivacy] = useState("private");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrivacy, setEditPrivacy] = useState("private");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boardDropdown, setBoardDropdown] = useState(false);

  const navigate = useNavigate();
  const MAX_RECENT = 4;

  // Handle window resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    setFetching(true);
    try {
      const response = await getWorkspaces();
      setBoards(response.data.data || []);
      setError("");
    } catch (error) {
      console.error("Failed to fetch workspaces", error);

      // fallback: load recent workspaces from localStorage
      const localRecent =
        JSON.parse(localStorage.getItem("recentWorkspaces")) || [];
      if (localRecent.length > 0) {
        setBoards(localRecent);
        setError("server unavailable");
        toast.info("Using recent workspaces from local storage ⚡");
      } else {
        setBoards([]);
        setError("We couldn’t load your workspaces. Please try again later.");
      }
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      await deleteWorkspace(id);
      setBoards((prev) => prev.filter((b) => b.id !== id));
      const updatedRecent = recentBoards.filter((b) => b.id !== id);
      setRecentBoards(updatedRecent);
      localStorage.setItem("recentWorkspaces", JSON.stringify(updatedRecent));
      toast.success("Workspace deleted successfully 🗑️");
    } catch (error) {
      toast.error("Failed to delete workspace ❌");
    }
  };

  const handleBoardClick = (board) => {
    setRecentBoards((prev) => {
      const updated = prev.filter((b) => b.id !== board.id);
      updated.unshift(board);
      if (updated.length > MAX_RECENT) updated.pop();
      localStorage.setItem("recentWorkspaces", JSON.stringify(updated));
      return updated;
    });
    navigate(`/dashboard/${board.id}/${board.name.replace(/\s+/g, "-")}`);
  };

  const openEditModal = (board) => {
    setEditId(board.id);
    setEditName(board.name);
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
      setBoards((prev) =>
        prev.map((board) =>
          board.id === editId ? { ...board, ...updatedWorkspace } : board
        )
      );

      // update recent workspaces + localStorage
      setRecentBoards((prev) => {
        const updated = prev.map((board) =>
          board.id === editId ? { ...board, ...updatedWorkspace } : board
        );
        localStorage.setItem("recentWorkspaces", JSON.stringify(updated));
        return updated;
      });

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
      setBoards(allWorkspaces);

      setShowModal(false);
      setWorkspaceName("");
      setWorkspacePrivacy("private");

      const newWorkspace = allWorkspaces.find((ws) => ws.name === payload.name);
      if (newWorkspace?.id) handleBoardClick(newWorkspace);

      toast.success("Workspace created ✅");
    } catch (error) {
      toast.error("Failed to create workspace ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdvSearchNav
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

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
                {boards.map((ws) => (
                  <div key={ws.id} className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2 border-bottom border-1">
                      <h5 className="fw-bold d-flex align-items-center gap-1 workspace-title ">
                        {ws.name}
                        <span className="badge workspace-badge ">
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
                            setShowModal(true);
                          }}
                        >
                          <span className="bi bi-pencil-fill"></span>Edit
                        </button>
                        <button
                          className=" workspace-btn"
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

                    {/* Boards under workspace */}

                    <div className="d-flex flex-wrap gap-3 mt-3  justify-content-center justify-content-md-start">
                      <CardBoard imgSrc={img} title="Board 1" variant="image" />
                      <CardBoard imgSrc={img} title="Board 2" variant="image" />
                      <CardBoard imgSrc={img} title="Board 3" variant="image" />
                      <CardBoard imgSrc={img} title="Board 4" variant="image" />
                      <CardBoard imgSrc={img} title="Board 5" variant="image" />
                      <CardBoard imgSrc={img} title="Board 6" variant="image" />
                      <CardBoard
                        title="Add Board"
                        variant="add"
                        onClick={() => setBoardDropdown(true)}
                      />
                      {/* dropdown */}

                      {boardDropdown && (
                        <div
                        className="dropdown-menu show p-3 shadow border-0"
                        style={{
                          width: "320px",
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 1050,
                        }}
                      >
                        <h6 className="fw-bold mb-3">Create board</h6>
              
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <div className="bg-primary rounded" style={{ width: "40px", height: "30px" }}></div>
                          <div className="bg-warning rounded" style={{ width: "40px", height: "30px" }}></div>
                          <div className="bg-success rounded" style={{ width: "40px", height: "30px" }}></div>
                          <div className="bg-info rounded" style={{ width: "40px", height: "30px" }}></div>
                        </div>
              
                        <div className="mb-3">
                          <label className="form-label">Board title *</label>
                          <input type="text" className="form-control" placeholder="Enter board title" />
                        </div>
              
                        <div className="mb-3">
                          <label className="form-label">Visibility</label>
                          <select className="form-select">
                            <option>Workspace</option>
                            <option>Private</option>
                          </select>
                        </div>
              
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => setBoardDropdown(false)}
                        >
                          Create
                        </button>
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
            {boards.filter((b) => b.type === "guest").length ? (
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                {boards
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
                  <i className="bi bi-plus-circle me-2"></i>Create a New
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
                    value={editName}
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
                    value={editPrivacy}
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
