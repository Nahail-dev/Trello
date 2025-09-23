import API, { getToken } from "./Api";

// Helper to attach token
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Authentication
export const login = (data) => API.post("login", data);

// ======================
// Workspace CRUD operations
// ======================

export const createWorkspace = (data) =>
  API.post("api/workspace", data, { headers: authHeader() });

export const getWorkspaces = () =>
  API.get("api/workspace", { headers: authHeader() });

export const updateWorkspace = (id, data) =>
  API.put(`api/workspace/${id}`, data, { headers: authHeader() });

export const deleteWorkspace = (id) =>
  API.delete(`api/workspace/${id}`, { headers: authHeader() });

// ======================
// Projects CRUD operations
// ======================

export const addProjects = (projectData, isFormData = false) => {
  return API.post("api/projects", projectData, {
    headers: {
      ...authHeader(),
      ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
    },
  });
};

export const getProjects = (workspace_id) => {
  return API.get(`api/projects/${workspace_id}`, { headers: authHeader() });
};

export const deleteProjects = (project_id) => {
  return API.delete(`api/projects/${project_id}`, { headers: authHeader() });
};

// User profile
// export const getUserProfile = () =>
//   API.get("/api/user/profile", { headers: authHeader() });
