import React from "react";
import { useTheme } from "./ThemeContext";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={styles.toggle}
      onClick={toggle}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <span className={styles.icon}>{isDark ? "☀️" : "🌙"}</span>
      <span className={styles.label}>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
