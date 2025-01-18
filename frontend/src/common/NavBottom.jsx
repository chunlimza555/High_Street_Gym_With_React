import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/authentication";
import { useEffect } from "react";

const NavBottom = () => {
  const { authenticatedUser } = useAuth();

  useEffect(() => {}, [authenticatedUser]);

  const userRole = authenticatedUser && authenticatedUser.role ? authenticatedUser.role : null;

  const GuestNavigation = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 text-white">
      <div>
        <span className="font-bold">About us</span>
        <div className="flex flex-col space-y-2 mt-2">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/blog" className="hover:underline">Blog</Link>
          <Link to="/class" className="hover:underline">Class</Link>
        </div>
      </div>
      <div>
        <span className="font-bold">Programs</span>
        <div className="flex flex-col space-y-2 mt-2">
          <Link to="/" className="hover:underline">Arena Fitness</Link>
          <Link to="/" className="hover:underline">Reform</Link>
        </div>
      </div>
      <div>
        <span className="font-bold">Follow us</span>
        <div className="flex space-x-4 mt-2">
          <a href="https://www.instagram.com" className="hover:underline">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.facebook.com" className="hover:underline">
            <FaFacebook size={24} />
          </a>
        </div>
      </div>
    </div>
  );

  const MemberNavigation = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 text-white">
      <div>
        <span className="font-bold">About us</span>
        <div className="flex flex-col space-y-2 mt-2">
          <Link to="/profile" className="hover:underline">Profile</Link>
          <Link to="/blog" className="hover:underline">Blog</Link>
          <Link to="/userbooking" className="hover:underline">Booking</Link>
        </div>
      </div>
      <div>
        <span className="font-bold">Programs</span>
        <div className="flex flex-col space-y-2 mt-2">
          {/* <Link to="/userbooking" className="hover:underline">Booking</Link> */}
          <Link to="/class" className="hover:underline">Class</Link>
          <Link to="/" className="hover:underline">Arena Fitness</Link>
          <Link to="/" className="hover:underline">Reform</Link>
        </div>
      </div>
      <div>
        <span className="font-bold">Follow us</span>
        <div className="flex space-x-4 mt-2">
          <a href="https://www.instagram.com" className="hover:underline">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.facebook.com" className="hover:underline">
            <FaFacebook size={24} />
          </a>
        </div>
      </div>
    </div>
  );

  const StaffNavigation = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 text-white">
      <div>
        <span className="font-bold">About us</span>
        <div className="flex flex-col space-y-2 mt-2">
          <Link to="/profile" className="hover:underline">Manage</Link>
          <Link to="/blog" className="hover:underline">Blog</Link>
          <Link to="/userbooking" className="hover:underline">Booking</Link>
        </div>
      </div>
      <div>
        <span className="font-bold">Programs</span>
        <div className="flex flex-col space-y-2 mt-2">
          {/* <Link to="/userbooking" className="hover:underline">Booking</Link> */}
          <Link to="/classtrainer" className="hover:underline">Class</Link>
          <Link to="/xml-import" className="hover:underline">Upload File</Link>
          <Link to="/" className="hover:underline">Reform</Link>
        </div>
      </div>
      <div>
        <span className="font-bold">Follow us</span>
        <div className="flex space-x-4 mt-2">
          <a href="https://www.instagram.com" className="hover:underline">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.facebook.com" className="hover:underline">
            <FaFacebook size={24} />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4">
        {!authenticatedUser && <GuestNavigation />}
        {authenticatedUser && userRole === "members" && <MemberNavigation />}
        {authenticatedUser && (userRole === "admin" || userRole === "trainer") && <StaffNavigation />}
      </div>
      <div className="bg-gray-900 text-center py-4 text-gray-400 text-sm">
        <div className="flex justify-center space-x-4">
          <Link to="/privacy-policy" className="hover:underline">Privacy policy</Link>
          <Link to="/terms" className="hover:underline">Terms and conditions</Link>
        </div>
        <p className="mt-2">&copy; 2024 Lim</p>
      </div>
    </footer>
  );
};

export default NavBottom;
