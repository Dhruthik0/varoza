import { Toaster } from "react-hot-toast";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "#111",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
    },
  }}
/>

      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

