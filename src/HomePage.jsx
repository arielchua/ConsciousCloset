import React, { useEffect, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
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
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/listings")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error("Error fetching listings:", err));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      setShowLogin(false);
      setEmail("");
      setPassword("");
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
      setEmail("");
      setPassword("");
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

  const handleCancel = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowResetPrompt(false);
    setEmail("");
    setPassword("");
    setResetEmail("");
    setError("");
    setResetMessage("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out");
  };

  return (
    <div className="homepage">
      {/* Login or Register Modal */}
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

      {/* Reset Password Modal */}
      {showResetPrompt && (
        <div className="auth-modal">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordReset();
            }}
            className="auth-form"
          >
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            {resetMessage && <p className="auth-error">{resetMessage}</p>}
            <button type="submit" className="btn submit-btn">
              Send Reset Link
            </button>
            <button type="button" onClick={handleCancel} className="btn cancel-btn">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <h1 className="header-title">ConsciousCloset</h1>
        <div className="header-buttons">
          {user ? (
            <>
              <button onClick={handleLogout} className="btn btn-outline">
                Log Out
              </button>
              <button className="btn btn-icon">
                <ShoppingCart size={20} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="btn btn-outline">
                Log In
              </button>
              <button onClick={() => setShowRegister(true)} className="btn btn-filled">
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Tagline */}
      <section className="tagline">
        <h2>Thrift. Curate. Resell.</h2>
        <p>
          ConsciousCloset is your sustainable fashion marketplace to buy, sell, and donate
          pre-loved clothes with ease. Join our community to make fashion circular.
        </p>
      </section>

      {/* Search */}
      <section className="search-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for jackets, jeans, or categories..."
          />
          <Search size={20} />
        </div>
      </section>

      {/* Listings */}
      <section className="listings">
        {listings.map((item) => (
          <div key={item._id} className="listing-card">
            <div
              className="listing-image"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
            <h3>{item.title}</h3>
            <p className="listing-meta">${item.price} • Category: {item.category}</p>
            <p className="listing-description">{item.description}</p>
            <button className="btn btn-view">View Item</button>
          </div>
        ))}
      </section>
    </div>
  );
}
