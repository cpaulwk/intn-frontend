import React from 'react';
import Link from 'next/link';
import { useSidebar } from '../../hooks/useSideBar';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { isAuthenticated, onGoogleLogin, onLogout } = useSidebar();

  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-100 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-10`}>
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800">
          ☰
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          ⚙️
        </button>
      </div>
      <nav className="p-4">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <ul>
          <li className="mb-2"><Link href="/" className="text-blue-600 hover:underline">Home</Link></li>
          <li className="mb-2"><Link href="/my-submissions" className="text-blue-600 hover:underline">My Submissions</Link></li>
          <li className="mb-2"><Link href="/my-favorites" className="text-blue-600 hover:underline">My Favorites</Link></li>
        </ul>
      </nav>
      <section className="p-4">
        <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
        <ul>
          {/* This would be populated dynamically based on user's recent activity */}
          <li className="mb-2"><Link href="#" className="text-blue-600 hover:underline">Recently viewed idea 1</Link></li>
          <li className="mb-2"><Link href="#" className="text-blue-600 hover:underline">Recently viewed idea 2</Link></li>
          <li className="mb-2"><Link href="#" className="text-blue-600 hover:underline">Recently viewed idea 3</Link></li>
        </ul>
      </section>
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-200">
        <div className="flex items-center justify-between">
          {isAuthenticated ? (
            <button onClick={onLogout} className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <span>Logout</span>
            </button>
          ) : (
            <button onClick={onGoogleLogin} className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white">G</div>
              <span>Login with Google</span>
            </button>
          )}
          <button className="text-gray-600 hover:text-gray-800">🔔</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;