import { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons/css/boxicons.min.css";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/Api";
import { AuthContext } from "../AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(formData.email, formData.password);

      if (res.access_token) {
        login(res.access_token);
        navigate("/");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div
        className="card bg-dark text-white p-4"
        style={{ borderRadius: "1rem", maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body d-flex flex-column align-items-center">
          <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
          <p className="text-white-50 mb-4">
            Please enter your login and password!
          </p>

          {error && <div className="alert alert-danger w-100">{error}</div>}

          <form onSubmit={handleLogin} className="w-100">
            {/* Email */}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <p className="small mb-3">
              <Link href="#!" className="text-white-50">
                Forgot password?
              </Link>
            </p>

            <button
              type="submit"
              className="btn btn-outline-light px-5 w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* <p className="mb-0 mt-3">
            Don't have an account?{" "}
            <Link to="/" className="text-white-50 fw-bold">
              Sign Up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
