/**
 * Navigation component
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: '🏠 Home' },
    { to: '/chat', label: '💬 AI Assistant' },
    { to: '/habits', label: '📊 Habits Tracker' },
    { to: '/learning', label: '📚 Learning' },
    { to: '/reminders', label: '⏰ Reminders' },
    { to: '/comfort', label: '👁️ Reading Comfort' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">👁️</span>
            <span className="font-bold text-lg hidden sm:inline">EyeCare AI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded transition ${
                  isActive(link.to)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-2 rounded transition ${
                  isActive(link.to)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
