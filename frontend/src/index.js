import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Find the root div in public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
