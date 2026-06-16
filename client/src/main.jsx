import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CompareProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CompareProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
