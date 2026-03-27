import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      alert("All fields required");
      return;
    }

    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      alert("Login successful");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "15px" }}>
        
        <h3 className="text-center mb-4 fw-bold">🔐 Login</h3>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="btn btn-primary w-100 mt-2" onClick={handleLogin}>
          Login
        </button>

        <p className="text-center mt-3 mb-0">
          Don’t have an account? <a href="/register">Register</a>
        </p>

      </div>
    </div>
  );
}