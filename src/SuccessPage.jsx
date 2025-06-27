import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css"; // Reuse your existing button and layout styles

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="cartpage" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#5a3e1b", marginTop: "80px" }}>
        ✅ Payment Successful!
      </h1>
      <p style={{ color: "#7b5c3f", fontSize: "1.2rem", margin: "20px 0" }}>
        Thank you for your purchase. Your items will be processed shortly.
      </p>
      <button className="btn btn-outline" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}
