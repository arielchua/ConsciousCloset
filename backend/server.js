// Load environment variables first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// ======= MongoDB Schemas =======

const listingSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  description: String,
  imageUrl: String,
  ownerEmail: String,
});

const Listing = mongoose.model("Listings", listingSchema);

const cartItemSchema = new mongoose.Schema({
  productId: String,
  title: String,
  price: Number,
  imageUrl: String,
  ownerEmail: String,
});

const CartItem = mongoose.model("CartItems", cartItemSchema);

// ======= Listing Routes =======

// Get all listings or listings by owner
app.get("/api/listings", async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    const listings = ownerEmail
      ? await Listing.find({ ownerEmail })
      : await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new listing
app.post("/api/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a listing
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

// Delete a listing
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

// ======= Cart Routes =======

// Get cart items for a user
app.get("/api/cart/:email", async (req, res) => {
  try {
    const items = await CartItem.find({ ownerEmail: req.params.email });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an item to cart
app.post("/api/cart", async (req, res) => {
  try {
    const item = new CartItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove an item from cart
app.delete("/api/cart/:id", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Clear all cart items for a user
app.delete("/api/cart/clear/:email", async (req, res) => {
  try {
    await CartItem.deleteMany({ ownerEmail: req.params.email });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// ======= Stripe Checkout =======

app.post("/api/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.imageUrl],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ======= Start Server =======

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(4000, () => console.log("🚀 Server running on port 4000"));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
