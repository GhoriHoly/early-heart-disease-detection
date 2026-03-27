import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setError("");

    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4 fw-bold">📝 Register</h3>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button
          className="btn btn-success w-100 mt-2"
          onClick={handleSubmit}
        >
          Register
        </button>

        <p className="text-center mt-3 mb-0">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}