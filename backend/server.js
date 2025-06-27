const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Define schema and model
const listingSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  description: String,
  imageUrl: String,
  ownerEmail: String, // <-- Add this to track who owns the listing
});

const Listing = mongoose.model("Listings", listingSchema);

// GET all listings
// GET all listings or just the current user's listings
app.get("/api/listings", async (req, res) => {
  try {
    const { ownerEmail } = req.query;

    const listings = ownerEmail
      ? await Listing.find({ ownerEmail }) // filter by user
      : await Listing.find();              // return all

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new listing
app.post("/api/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body); // expects ownerEmail in body
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a listing by ID — only owner can update
app.put("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.ownerEmail !== req.body.ownerEmail) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a listing by ID — only owner can delete
app.delete("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.ownerEmail !== req.body.ownerEmail) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


const cartItemSchema = new mongoose.Schema({
  productId: String,
  title: String,
  price: Number,
  imageUrl: String,
  ownerEmail: String,
});

const CartItem = mongoose.model("CartItems", cartItemSchema);

// Get cart items for a user
app.get("/api/cart/:email", async (req, res) => {
  try {
    const items = await CartItem.find({ ownerEmail: req.params.email });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart
app.post("/api/cart", async (req, res) => {
  try {
    const item = new CartItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove from cart
app.delete("/api/cart/:id", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
