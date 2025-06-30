import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./CartPage.css"; // Reuse your existing styles

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Clear cart for the logged-in user
          await fetch(`http://localhost:4000/api/cart/clear/${user.email}`, {
            method: "DELETE",
          });
          console.log("Cart cleared after successful payment.");
        } catch (err) {
          console.error("Failed to clear cart:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
