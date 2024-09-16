// src/components/Navbar.tsx

import React, { useState } from 'react';
const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

 
  return (
    <header className="tw-bg-blue-600 tw-text-white">
      <nav className="tw-container tw-mx-auto tw-flex tw-items-center  tw-justify-between tw-p-4">
        <div className="tw-text-xl tw-w-[200px] tw-font-bold">Budgeting App</div>

        {/* Toggle button only visible on mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:tw-hidden focus:tw-outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ?  '✕' : '☰'}
        </button>

        {/* Navbar items: always visible on desktop, toggle on mobile */}
        <ul
          className={`tw-flex tw-flex-row md:tw-flex-row md:tw-items-center md:tw-space-x-6 tw-absolute tw-bg-blue-600 tw-w-full md:tw-w-auto tw-transition-all tw-justify-end tw-duration-300 tw-ease-in-out md:tw-static ${
            isMobileMenuOpen ? 'tw-top-16 tw-flex-col tw-left-0 tw-flex-wrap tw-gap-2' : 'tw-top-[-400px] tw-left-0'
          } md:tw-top-0 md:tw-left-auto md:tw-bg-transparent`}
        >
          <li>
            <a href="/dashboard" className="tw-block tw-px-4 tw-py-2 md:tw-py-0 hover:tw-bg-blue-600 md:hover:tw-bg-transparent">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/budget" className="tw-block tw-px-4 tw-py-2 md:tw-py-0 hover:tw-bg-blue-700 md:hover:tw-bg-transparent">
              Budget
            </a>
          </li>
          <li>
            <a href="/transaction" className="tw-block tw-px-4 tw-py-2 md:tw-py-0 hover:tw-bg-blue-700 md:hover:tw-bg-transparent">
              Transaction
            </a>
          </li>
          <li>
            <a href="/category" className="tw-block tw-px-4 tw-py-2 md:tw-py-0 hover:tw-bg-blue-700 md:hover:tw-bg-transparent">
              Category
            </a>
          </li>
          <li>
            <button onClick={handleLogout} className="tw-block tw-px-4 tw-py-2 md:tw-py-0 hover:tw-bg-blue-700 md:hover:tw-bg-transparent">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
