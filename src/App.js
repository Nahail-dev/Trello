import Dashboard from "./components/pages/Dashboard/DashBoard";
import Board from "./components/pages/Board/Board";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/login/Login";
import ProtectedRoute from "./auth/ProtectedRoutes";
import { AuthProvider } from "./auth/AuthContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard/:id/:name"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Board />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;
