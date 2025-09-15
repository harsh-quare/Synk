import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Sticky navbar at the top */}
      <Navbar />

      {/* Main content area that expands and scrolls */}
      <main className="flex-grow overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
