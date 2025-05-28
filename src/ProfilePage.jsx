import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "Outerwear",
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserListings(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserListings = async (email) => {
    const res = await fetch(`http://localhost:4000/api/listings?ownerEmail=${email}`);
    const data = await res.json();
    setListings(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:4000/api/listings/${editingId}`
      : "http://localhost:4000/api/listings";

    const listingData = { ...form, ownerEmail: user.email };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listingData),
    });

    if (res.ok) {
      alert(editingId ? "Listing updated" : "Listing added");
      setForm({ title: "", price: "", description: "", imageUrl: "", category: "Outerwear" });
      setEditingId(null);
      fetchUserListings(user.email);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this listing?")) return;

  const res = await fetch(`http://localhost:4000/api/listings/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ownerEmail: user.email }), // ✅ include ownerEmail
  });

  if (res.ok) {
    alert("Listing deleted");
    fetchUserListings(user.email);
  } else {
    const err = await res.json();
    alert("Failed to delete listing: " + err.message);
  }
};

  const handleEdit = (listing) => {
    setForm({
      title: listing.title,
      price: listing.price,
      description: listing.description,
      imageUrl: listing.imageUrl,
      category: listing.category,
    });
    setEditingId(listing._id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      price: "",
      description: "",
      imageUrl: "",
      category: "Outerwear",
    });
  };

  return (
    <div className="profile-page">
      <div className="top-left">
        <button onClick={() => navigate("/")} className="btn btn-outline">
          ← Back to Home
        </button>
      </div>

      <h1>Your Listings</h1>

      <div className="listing-grid">
        {listings.map((item) => (
          <div key={item._id} className="listing-card">
            <div
              className="listing-image"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
            <h3>{item.title}</h3>
            <p className="price">${item.price}</p>
            <p className="category">{item.category}</p>
            <button className="btn btn-view" onClick={() => handleEdit(item)}>Edit</button>
            <button className="btn btn-outline" onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        ))}
      </div>

      <h2>{editingId ? "Edit Listing" : "Upload New Listing"}</h2>
      <form className="listing-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          required
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Outerwear">Outerwear</option>
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Footwear">Footwear</option>
          <option value="Accessories">Accessories</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <button className="btn btn-filled" type="submit">
          {editingId ? "Update Listing" : "Upload Listing"}
        </button>

        {editingId && (
          <button type="button" className="btn btn-outline" onClick={cancelEdit}>
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}
