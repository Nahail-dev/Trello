import axios from "axios";

const API_BASE_URL = "https://trello.ai3dscanning.com/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const saveToken = (token) => {
  return localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const clearToken = () => {
  localStorage.removeItem("authToken");
};

// export const getUserProfile = async () => {
//   const token = getToken()
//   if (!token) throw new Error("No token found")

//   const response = await api.get("/api/user/profile", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   return response.data
// }

export const loginUser = async (email, password) => {
  const response = await api.post("/api/login", {
    email,
    password,
  });

  if (response.data?.access_token) {
    saveToken(response.data.access_token); // ✅ use access_token
  }

  return response.data;
};

export default api;
