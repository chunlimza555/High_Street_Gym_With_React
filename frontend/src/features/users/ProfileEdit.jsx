import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/authentication";
import { updateUserProfile, getByAuthenticationKey } from "../../api/users";
import { useNavigate } from "react-router-dom";

export default function ProfileEdit() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    role: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authenticatedUser) {
      setFormData({
        id: authenticatedUser.id?.toString() || "",
        email: authenticatedUser.email || "",
        password: "",
        role: authenticatedUser.role || "",
        phone: authenticatedUser.phone || "",
        firstname: authenticatedUser.firstname || "",
        lastname: authenticatedUser.lastname || "",
        address: authenticatedUser.address || "",
      });
    }
  }, [authenticatedUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { role, ...updatedData } = formData;

      const response = await updateUserProfile(
        authenticatedUser.authentication_key,
        updatedData
      );

      if (response.status === 200) {
        const refreshedUser = await getByAuthenticationKey(
          authenticatedUser.authentication_key
        );
        setAuthenticatedUser(refreshedUser);
        navigate("/profile");
      } else {
        setErrorMessage(response.message || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating the profile.");
    }
  };

  return (
    <>
      <Header />
      <div
        className="flex justify-center items-center min-h-screen px-4 sm:px-0"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-sm md:max-w-md bg-[#0079B8] bg-opacity-80 border border-slate-600 rounded-lg p-6 sm:p-8 shadow-lg backdrop-filter backdrop-blur-lg relative">
          <h2 className="text-white text-center text-3xl font-bold mb-6">
            Edit Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full text-black text-xs border-none px-2 py-2 rounded bg-white"
              />
            </div>

            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full text-black text-xs border-none px-2 py-2 rounded bg-white"
                placeholder="Enter new password (if you want to change)"
              />
            </div>

            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">Role</label>
              <input
                name="role"
                type="text"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full text-black text-xs border-none px-2 py-2 rounded bg-white"
                disabled={authenticatedUser.role !== "admin"} // Disable for non-admins
              />
            </div>

            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full text-black text-xs border-none px-2 py-2 rounded bg-white"
              />
            </div>

            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">First Name</label>
              <input
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                className="w-full text-black text-xs border-none px-2 py-2 rounded bg-white"
              />
            </div>

            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">Last Name</label>
              <input
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                className="w-full text-black text-xs border-none px-2 py-2 rounded bg-white"
              />
            </div>

            <div className="mb-3">
              <label className="text-white text-xs mb-1 block">Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full text-black text-xs border-none px-2 py-2 rounded bg-white"
              />
            </div>

            {errorMessage && (
              <div className="text-red-500 text-xs mb-3">{errorMessage}</div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 text-xs tracking-wide rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
