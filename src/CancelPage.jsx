import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css"; // Reuse your existing styles

export default function CancelPage() {
  const navigate = useNavigate();

  return (
    <div className="cartpage" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#5a3e1b", marginTop: "80px" }}>
        ❌ Payment Cancelled
      </h1>
      <p style={{ color: "#7b5c3f", fontSize: "1.2rem", margin: "20px 0" }}>
        Your checkout was cancelled. You can continue shopping anytime.
      </p>
      <button className="btn btn-outline" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}
