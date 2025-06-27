import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { loadStripe } from "@stripe/stripe-js";
import "./CartPage.css";

// Stripe setup
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetch(`http://localhost:4000/api/cart/${currentUser.email}`)
          .then((res) => res.json())
          .then((data) => setCartItems(data))
          .catch((err) => console.error("Error fetching cart:", err));
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/cart/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCartItems(cartItems.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete cart item:", err);
    }
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const res = await fetch("http://localhost:4000/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await res.json();

    const result = await stripe.redirectToCheckout({
      sessionId: data.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <div className="cartpage">
      <header className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <button onClick={() => navigate("/")} className="btn btn-outline">
          ← Back to Home
        </button>
      </header>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <section className="cart-listings">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-card">
                <div
                  className="cart-image"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                <div className="cart-details">
                  <h3>{item.title}</h3>
                  <p className="cart-price">${item.price}</p>
                  <button
                    className="btn cancel-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </section>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button className="btn btn-filled" onClick={handleCheckout}>
              Checkout with Stripe
            </button>
          </div>
        </>
      )}
    </div>
  );
}
