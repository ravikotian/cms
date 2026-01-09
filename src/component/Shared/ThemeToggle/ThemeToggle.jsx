import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import './ThemeToggle.css';

/**
 * Theme Toggle Component
 * Displays theme switcher in navbar
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <div className="theme-toggle-buttons">
        <button
          className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
          onClick={() => toggleTheme('light')}
          title="Light Mode"
          aria-label="Light mode"
        >
          ☀️
        </button>
        <button
          className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
          onClick={() => toggleTheme('system')}
          title="System Mode"
          aria-label="System mode"
        >
          🖥️
        </button>
        <button
          className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => toggleTheme('dark')}
          title="Dark Mode"
          aria-label="Dark mode"
        >
          🌙
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
