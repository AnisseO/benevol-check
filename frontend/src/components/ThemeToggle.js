// src/components/ThemeToggle.js
import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        marginTop: "10px",
        padding: "8px 14px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        backgroundColor: darkMode ? "#444" : "#ff7f50",
        color: "white",
      }}
    >
      {darkMode ? "🌙 Mode sombre" : "☀️ Mode clair"}
    </button>
  );
};

export default ThemeToggle;
