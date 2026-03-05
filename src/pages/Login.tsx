import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [flatNumber, setFlatNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flatNumber, pin }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("loggedInFlat", flatNumber.toUpperCase());
        navigate("/complaint");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* 🔵 HEADER */}
      <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Community Portal</h1>
            <p className="text-sm">
              Gated Community Complaint Management System
            </p>
          </div>
          <div className="text-sm text-right">
            <p>📞 +91 98765 43210</p>
            <p>✉ support@community.com</p>
          </div>
        </div>
      </div>

      {/* 🔵 LOGIN CENTER */}
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="border p-8 rounded-xl shadow-lg space-y-4 w-80 bg-white"
        >
          <h2 className="text-xl font-bold text-center">Flat Login</h2>

          <input
            type="text"
            placeholder="Flat Number (A-101)"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded"
          >
            Login
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>

      {/* ⚫ FOOTER */}
      <div className="bg-black text-white text-center py-4 text-sm">
        <p className="font-semibold">Community Portal</p>
        <p>Making community living better, one complaint at a time.</p>
        <p className="mt-2 text-gray-400">
          © 2026 Community Portal. All rights reserved.
        </p>
      </div>

    </div>
  );
}