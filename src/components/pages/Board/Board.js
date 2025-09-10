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
} from "../../../api/auth";
import { ToastContainer, toast } from "react-toastify";

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
    } catch (error) {
      console.error("Failed to fetch workspaces", error);
    } finally {
      setFetching(false);
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

  const handleDeleteWorkspace = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workspace?"))
      return;

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

  const handleUpdateWorkspace = async () => {
    if (!editName) return toast.warning("Workspace name cannot be empty ⚠️");

    try {
      const payload = { name: editName, privacy: editPrivacy };
      const response = await updateWorkspace(editId, payload);
      const updatedWorkspace = response.data.data;

      setBoards((prev) =>
        prev.map((board) =>
          board.id === editId ? { ...board, ...updatedWorkspace } : board
        )
      );
      setRecentBoards((prev) =>
        prev.map((board) =>
          board.id === editId ? { ...board, ...updatedWorkspace } : board
        )
      );
      localStorage.setItem("recentWorkspaces", JSON.stringify(recentBoards));

      setShowEditModal(false);
      setEditId(null);
      setEditName("");
      toast.success("Workspace updated ✅");
    } catch (error) {
      toast.error("Failed to update workspace ❌");
    }
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
      <ToastContainer />
      <AdvSearchNav
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="container">
        <div className="row">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="col-12 col-md-3 sidebar-wrapper">
              <div className="sidebar-main">
                <div className="sidebar-item active">Board</div>
                <div className="sidebar-item">Template</div>
                <div className="sidebar-item">Home</div>
              </div>

              <div className="sidebar-other mt-3">
                <div className="sidebar-item">Projects</div>
                <div className="sidebar-item">Reports</div>
                <div className="sidebar-item">Settings</div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={sidebarOpen ? "col-12 col-md-9 main-content" : "col-12 main-content"}>
            {/* Recently Viewed */}
            <div className="mb-4">
              <div className="header-with-icon mb-2">
                <span className="bi bi-clock fs-4 text-secondary me-2"></span>
                <h4 className="text-secondary mb-0">Recently Viewed</h4>
              </div>
              {recentBoards.length ? (
                <div className="d-flex flex-wrap gap-3 mb-4">
                  {recentBoards.map((board) => (
                    <CardBoard
                      key={board.id}
                      name={board.name}
                      onEdit={() => openEditModal(board)}
                      onDelete={() => handleDeleteWorkspace(board.id)}
                      onClick={() => handleBoardClick(board)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-secondary mb-4">No recently viewed boards</p>
              )}
            </div>

            {/* Your Workspaces */}
            <div className="mb-4">
              <div className="header-with-icon mb-2">
                <span className="bi bi-folder fs-4 text-secondary me-2"></span>
                <h4 className="text-secondary mb-0">Your Workspaces</h4>
              </div>
              {fetching ? (
                <div className="d-flex justify-content-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-3 mb-5">
                  {boards.map((board) => (
                    <CardBoard
                      key={board.id}
                      name={board.name}
                      onEdit={() => openEditModal(board)}
                      onDelete={() => handleDeleteWorkspace(board.id)}
                      onClick={() => handleBoardClick(board)}
                    />
                  ))}
                </div>
              )}
              <p className="text-secondary">
                You are not a member of any workspaces yet.{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setShowModal(true)}
                >
                  Create a workspace
                </button>
              </p>
            </div>

            {/* Guest Workspaces */}
            <div className="mb-4">
              <div className="header-with-icon mb-2">
                <span className="bi bi-person fs-4 text-secondary me-2"></span>
                <h4 className="text-secondary mb-0">Guest Workspace</h4>
              </div>
              {boards.filter((b) => b.type === "guest").length ? (
                <div className="d-flex flex-wrap gap-3 mb-4">
                  {boards
                    .filter((b) => b.type === "guest")
                    .map((board) => (
                      <CardBoard
                        key={board.id}
                        name={board.name}
                        onEdit={() => openEditModal(board)}
                        onDelete={() => handleDeleteWorkspace(board.id)}
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
      </div>

      {/* Modals (Create/Edit) */}
      {showModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-secondary">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>Create a New Workspace
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
                    <option value="private">Private - Only invited members can see</option>
                    <option value="public">Public - Anyone with the link can view</option>
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
                  {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                  Create Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
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
                    <option value="private">Private - Only invited members can see</option>
                    <option value="public">Public - Anyone with the link can view</option>
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
    </>
  );
}

export default Board;
