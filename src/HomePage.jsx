import React from "react";
import { Search } from "lucide-react";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fef7eb",
        padding: "40px",
        fontFamily: "Segoe UI, sans-serif",
        color: "#5a3e1b",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "48px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontSize: "2.75rem",
            fontWeight: "bold",
            color: "#5a3e1b",
            marginBottom: "12px",
          }}
        >
          ConsciousCloset
        </h1>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            style={{
              padding: "10px 18px",
              border: "2px solid #5a3e1b",
              backgroundColor: "transparent",
              color: "#5a3e1b",
              fontWeight: "600",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Log In
          </button>
          <button
            style={{
              padding: "10px 18px",
              backgroundColor: "#5a3e1b",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      <section style={{ textAlign: "center", marginBottom: "48px" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "600",
            color: "#5a3e1b",
            marginBottom: "16px",
          }}
        >
          Thrift. Curate. Resell.
        </h2>
        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            color: "#7b5c3f",
            fontSize: "1.05rem",
            lineHeight: "1.6",
          }}
        >
          ConsciousCloset is your sustainable fashion marketplace to buy, sell, and
          donate pre-loved clothes with ease. Join our community to make fashion
          circular.
        </p>
      </section>

      <section style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "640px" }}>
          <input
            type="text"
            placeholder="Search for jackets, jeans, or categories..."
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              fontSize: "1rem",
              border: "1.5px solid #c9ab8c",
              borderRadius: "6px",
              outline: "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          />
          <Search
            size={20}
            style={{
              position: "absolute",
              top: "50%",
              left: "12px",
              transform: "translateY(-50%)",
              color: "#c9ab8c",
            }}
          />
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "28px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #eadcc5",
              borderRadius: "14px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              padding: "20px",
              transition: "0.2s ease-in-out",
            }}
          >
            <div
              style={{
                height: "180px",
                backgroundColor: "#f6e6d3",
                borderRadius: "10px",
                marginBottom: "16px",
              }}
            ></div>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#5a3e1b",
                marginBottom: "4px",
              }}
            >
              Vintage Denim Jacket
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#7b5c3f", marginBottom: "16px" }}>
              $25 • Category: Outerwear
            </p>
            <button
              style={{
                width: "100%",
                backgroundColor: "#a97442",
                color: "#fff",
                padding: "10px",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              View Item
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
