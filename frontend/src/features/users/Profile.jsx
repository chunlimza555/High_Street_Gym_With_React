import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/authentication";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function Profile() {
  const { authenticatedUser } = useAuth(); // Assuming you have an authenticated user
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
  });

  // Load authenticated user's data into the form when the component mounts
  useEffect(() => {
    if (authenticatedUser) {
      setFormData({
        email: authenticatedUser.email || "",
        password: "********",
        phone: authenticatedUser.phone || "",
        address: authenticatedUser.address || "",
      });
    }
  }, [authenticatedUser]);

  return (
    <>
      <Header />
      <div
        className="flex justify-center items-center min-h-screen px-4 sm:px-0"
        style={{
          backgroundImage: "url('/bg.jpg')", // Use your background image path here
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-sm md:max-w-md bg-[#0079B8] bg-opacity-80 border border-slate-600 rounded-lg p-6 sm:p-8 shadow-lg backdrop-filter backdrop-blur-lg relative">
          <h2 className="text-white text-center text-3xl font-bold mb-6">
            Your Profile
          </h2>

          <form className="w-full">
            <div className="mb-3">
              <label className="text-white text-sm mb-1 block">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full text-black text-sm border-none px-2 py-2 rounded bg-white cursor-not-allowed"
              />
            </div>

            <div className="mb-3">
              <label className="text-white text-sm mb-1 block">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                disabled
                className="w-full text-black text-sm border-none px-2 py-2 rounded bg-white cursor-not-allowed"
              />
            </div>

            <div className="mb-3">
              <label className="text-white text-sm mb-1 block">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                disabled
                className="w-full text-black text-sm border-none px-2 py-2 rounded bg-white cursor-not-allowed"
              />
            </div>


            <div className="mb-3">
              <label className="text-white text-sm mb-1 block">Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                disabled
                className="w-full text-black text-sm border-none px-2 py-2 rounded bg-white cursor-not-allowed"
              />
            </div>


            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  navigate(`/ProfileEdit/${authenticatedUser.id}`)
                }
                className="w-full py-2 text-xs tracking-wide rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
