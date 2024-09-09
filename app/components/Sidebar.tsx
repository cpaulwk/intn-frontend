import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../features/auth/authSlice';
import { AppDispatch, RootState } from '../store';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL}`;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        dispatch(clearUser());
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Top Ideas</h2>
        <ul>
          <li className="mb-2">
            <Link href="#" className="text-blue-600 hover:underline">
              Personalized Pet Subscription Boxes
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="text-blue-600 hover:underline">
              Eco-Friendly Home Cleaning Service
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="text-blue-600 hover:underline">
              Virtual Reality (VR) Gaming Lounge
            </Link>
          </li>
        </ul>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-200">
        <div className="flex items-center justify-between">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white">
                G
              </div>
              <span>Login with Google</span>
            </button>
          )}
          <button className="text-gray-600 hover:text-gray-800">
            🔔
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;