import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

interface AuthButtonProps {
  type: 'Login' | 'Logout';
  onClick?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ type, onClick }) => {
  const isLogin = type === 'Login';

  return (
    <button
      onClick={onClick}
      className={`flex items-center rounded-full ${isLogin ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} px-4 py-2 text-white transition-colors duration-200`}
    >
      {isLogin ? (
        <>
          <svg
            className="mr-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
          </svg>
          <span>Login with Google</span>
        </>
      ) : (
        <>
          <LogOut size={20} className="mr-2" />
          <span>Logout</span>
        </>
      )}
    </button>
  );
};

export default AuthButton;
