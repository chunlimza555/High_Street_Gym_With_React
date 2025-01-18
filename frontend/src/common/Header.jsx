import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authentication";
import { useState } from "react";

const Header = () => {
  const { authenticatedUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // State to manage mobile menu visibility
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout().then(() => {
      navigate("/"); // Navigate to homepage after logout
    });
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="navbar bg-base-100 text-white flex justify-between items-center px-6 py-4 shadow-lg" style={{ backgroundColor: '#353E47' }}>
      {/* Logo and Gym Name */}
      <Link to="/" className="flex items-center space-x-3">
        <img src="/Logo-High-Street-Gym.png" alt="High Street Gym Logo" className="h-10 w-10" />
        <span className="text-2xl font-semibold tracking-wide">High Street Gym</span>
      </Link>

      {/* Hamburger Menu Icon */}
      <div className="lg:hidden flex items-center">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {/* Hamburger Icon */}
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Buttons Section */}
      <div className="hidden lg:flex items-center space-x-3 lg:space-x-6">
        {/* Try us for free button */}
        <button className="border border-white text-white py-2 px-3 sm:px-4 md:px-6 rounded-full hover:bg-white hover:text-[#353E47] transition-all duration-300 ease-in-out">
          Try us for free
        </button>

        {/* Login / Logout Button */}
        {!authenticatedUser ? (
          <button onClick={handleLogin} className="border border-white text-white py-2 px-3 sm:px-4 md:px-6 rounded-full hover:bg-white hover:text-[#353E47] transition-all duration-300 ease-in-out">
            Login
          </button>
        ) : (
          <button onClick={handleLogout} className="border border-white text-white py-2 px-3 sm:px-4 md:px-6 rounded-full hover:bg-white hover:text-[#353E47] transition-all duration-300 ease-in-out">
            Logout
          </button>
        )}
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-0 bg-[#353E47] text-white w-48 shadow-lg rounded-lg p-4 transition-transform duration-300 ease-in-out z-50">
          <div className="flex flex-col items-start space-y-4">
            {/* Menu Items */}
            <Link to="/clubs" className="text-lg hover:text-gray-300">Clubs</Link>
            <Link to="/memberships" className="text-lg hover:text-gray-300">Memberships</Link>
            <Link to="/train" className="text-lg hover:text-gray-300">Train</Link>
            <Link to="/classes" className="text-lg hover:text-gray-300">Classes</Link>

            {/* Divider */}
            <div className="border-t border-gray-500 w-full mt-2" />

            {/* Try us for free button in the mobile menu */}
            <button className="border border-white text-white py-2 px-4 rounded-full w-full hover:bg-white hover:text-[#353E47] transition-all duration-300 ease-in-out">
              Try us for free
            </button>

            {/* Login / Logout Button in the mobile menu */}
            {!authenticatedUser ? (
              <button onClick={handleLogin} className="border border-white text-white py-2 px-4 rounded-full w-full hover:bg-white hover:text-[#353E47] transition-all duration-300 ease-in-out">
                Login
              </button>
            ) : (
              <button onClick={handleLogout} className="border border-white text-white py-2 px-4 rounded-full w-full hover:bg-white hover:text-[#353E47] transition-all duration-300 ease-in-out">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
