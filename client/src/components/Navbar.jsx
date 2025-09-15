import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <svg
              className="h-9 w-9"
              viewBox="0 -1 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#4f46e5" }} />
                  <stop offset="100%" style={{ stopColor: "#7c3aed" }} />
                </linearGradient>
              </defs>
              <path
                d="M8 8C10.2091 8 12 9.79086 12 
                12C12 14.2091 10.2091 16 8 16"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 16C13.7909 16 12 14.2091 12 
                12C12 9.79086 13.7909 8 16 8"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Synk
            </span>
          </Link>

          <div className="flex items-center">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
