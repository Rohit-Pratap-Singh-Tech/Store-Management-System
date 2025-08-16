import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200">
      <nav
        className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4"
        style={{ minHeight: '72px' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-8 sm:h-10 lg:h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {[
            { name: 'Home', to: '/' },
            { name: 'Features', to: '#features' },
            { name: 'Contact', to: '#contact' },
          ].map((link) => (
            <a
              key={link.name}
              href={link.to}
              className="text-gray-700 font-semibold hover:text-sky-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-sky-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {[
              { name: 'Home', to: '/' },
              { name: 'Features', to: '#features' },
              { name: 'Contact', to: '#contact' },
            ].map((link) => (
              <a
                key={link.name}
                href={link.to}
                className="block px-3 py-2 text-gray-700 font-medium hover:text-sky-600 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
