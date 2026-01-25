import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { MotionConfig } from "motion/react";

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  // Check if it's the known Chrome extension error
  if (
    event.reason &&
    typeof event.reason === "object" &&
    event.reason.message &&
    event.reason.message.includes(
      "A listener indicated an asynchronous response",
    )
  ) {
    // Suppress this error as it's from browser extensions
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <MotionConfig viewport={{ once: true }}>
        <App />
      </MotionConfig>
    </AppProvider>
  </BrowserRouter>,
);
