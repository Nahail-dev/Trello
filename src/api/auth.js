import API, { getToken } from "./Api";

// Helper to attach token
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Authentication
export const login = (data) => API.post("/login", data);
export const signup = (data) => API.post("/signup", data);

// Workspace CRUD operations  
export const createWorkspace = (data) =>
  API.post("api/workspace", data, { headers: authHeader() });

export const getWorkspaces = () =>
  API.get("api/workspace", { headers: authHeader() });

export const updateWorkspace = (id, data) =>
  API.put(`api/workspace/${id}`, data, { headers: authHeader() });

export const deleteWorkspace = (id) =>
  API.delete(`api/workspace/${id}`, { headers: authHeader() });

// User profile
// export const getUserProfile = () =>
//   API.get("/api/user/profile", { headers: authHeader() });
