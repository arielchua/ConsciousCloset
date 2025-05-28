import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";
import "./HomePage.css";

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setFilteredListings(data);
      })
      .catch((err) => console.error("Error fetching listings:", err));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = listings.filter((item) =>
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
    setFilteredListings(filtered);
  }, [searchQuery, listings]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      setShowLogin(false);
      clearFields();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful");
      setShowRegister(false);
      clearFields();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Reset link sent! Check your inbox.");
    } catch (err) {
      setResetMessage(err.message);
    }
  };

  const handleAddToCart = async (item) => {
    if (!user) return alert("Please log in to add to cart");

    const cartItem = {
      productId: item._id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
      ownerEmail: user.email,
    };

    try {
      const res = await fetch("http://localhost:4000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });
      if (res.ok) {
        alert("Item added to cart!");
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (err) {
      alert("Failed to add to cart");
      console.error(err);
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setResetEmail("");
    setError("");
    setResetMessage("");
  };

  const handleCancel = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowResetPrompt(false);
    clearFields();
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out");
  };

  return (
    <div className="homepage">
      {/* Auth Modal */}
      {(showLogin || showRegister) && (
        <div className="auth-modal">
          <form onSubmit={showLogin ? handleLogin : handleRegister} className="auth-form">
            <h2>{showLogin ? "Log In" : "Sign Up"}</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn submit-btn">
              {showLogin ? "Log In" : "Sign Up"}
            </button>
            <button type="button" onClick={handleCancel} className="btn cancel-btn">
              Cancel
            </button>
            {showLogin && (
              <button
                type="button"
                className="forgot-link"
                onClick={() => {
                  setShowResetPrompt(true);
                  setResetEmail(email);
                  setResetMessage("");
                }}
              >
                Forgot Password?
              </button>
            )}
          </form>
        </div>
      )}

      {/* Reset Modal */}
      {showResetPrompt && (
        <div className="auth-modal">
          <form onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }} className="auth-form">
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            {resetMessage && <p className="auth-error">{resetMessage}</p>}
            <button type="submit" className="btn submit-btn">Send Reset Link</button>
            <button type="button" onClick={handleCancel} className="btn cancel-btn">Cancel</button>
          </form>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-title-wrapper">
          <h1 className="header-title">ConsciousCloset</h1>
        </div>

        {user ? (
          <div className="header-button-row">
            <button className="btn btn-icon" onClick={() => navigate("/cart")}>
              <ShoppingCart size={20} />
            </button>
            <button className="btn btn-icon" onClick={() => navigate("/profile")}>
              <User size={20} />
            </button>
            <button onClick={handleLogout} className="btn btn-outline">Log Out</button>
          </div>
        ) : (
          <div className="header-button-row">
            <button onClick={() => setShowLogin(true)} className="btn btn-outline">Log In</button>
            <button onClick={() => setShowRegister(true)} className="btn btn-filled">Sign Up</button>
          </div>
        )}
      </header>

      {/* Tagline */}
      <section className="tagline">
        <h2>Thrift. Curate. Resell.</h2>
        <p>ConsciousCloset is your sustainable fashion marketplace to buy, sell, and donate pre-loved clothes with ease.</p>
      </section>

      {/* Search */}
      <section className="search-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for jackets, jeans, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} />
        </div>
      </section>

      {/* Listings */}
      <section className="listings">
        {filteredListings.map((item) => (
          <div key={item._id} className="listing-card">
            <div
              className="listing-image"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
            <h3>{item.title}</h3>
            <p className="listing-meta">${item.price}</p>
            <button className="btn btn-view" onClick={() => setSelectedListing(item)}>
              View Item
            </button>
          </div>
        ))}
      </section>

      {/* Listing Modal */}
      {selectedListing && (
        <div className="auth-modal" onClick={() => setSelectedListing(null)}>
          <div className="auth-form" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedListing.title}</h2>
            <img src={selectedListing.imageUrl} className="listing-modal-image" alt="" />
            <p><strong>Category:</strong> {selectedListing.category}</p>
            <p><strong>Price:</strong> ${selectedListing.price}</p>
            <p className="listing-description">{selectedListing.description}</p>
            {user && (
              <button
                className="btn submit-btn"
                onClick={() => handleAddToCart(selectedListing)}
              >
                Add to Cart
              </button>
            )}
            <button className="btn cancel-btn" onClick={() => setSelectedListing(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
