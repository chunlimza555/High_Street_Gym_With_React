import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import * as Users from "../../api/users";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
  });

  // Handle input changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function RegisterSubmit(Reg) {
    Reg.preventDefault();
    setStatusMessage("Registering...");

    // Email validation
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(formData.email)) {
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    // First name validation
    const nameValidation = /^[a-zA-Z-]{2,}$/;
    if (!nameValidation.test(formData.firstname)) {
      setStatusMessage("First name must contain at least two letters.");
      return;
    }

    // Last name validation
    if (!nameValidation.test(formData.lastname)) {
      setStatusMessage("Last name must contain at least two letters.");
      return;
    }

    // Phone validation
    const phoneValidation = /^[0-9]{10}$/;
    if (!phoneValidation.test(formData.phone)) {
      setStatusMessage("Phone number must be 10 digits.");
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setStatusMessage("Password must be at least 6 characters long.");
      return;
    }

    // If all validations pass
    setStatusMessage("All fields are valid. Submitting form...");

    // Send formData to the backend
    Users.registerUser(formData)
      .then((result) => {
        setStatusMessage(result.message);
        // Redirect to the login page after successful registration
        navigate("/login"); // Change the route to your login page
      })
      .catch((error) => {
        setStatusMessage("Registration failed: " + error.message);
      });
  }

  return (
    <>
      <Header />
      <div
        className="min-h-screen font-[sans-serif] pb-20 flex justify-center items-center"
        style={{
          backgroundImage: "url('/bg.jpg')", // Change this to image path
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-[#51a6d3] bg-opacity-80 p-8 rounded-2xl shadow max-w-md w-full m-3">
          <h2 className="text-white text-center text-2xl font-bold">Register</h2>
          <form className="mt-8 space-y-4" onSubmit={RegisterSubmit}>
            <div>
              <label className="text-white text-sm mb-2 block">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-grey-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-grey-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">First Name</label>
              <input
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-grey-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Last Name</label>
              <input
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-grey-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-grey-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-grey-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Register
              </button>
            </div>
            <p className="text-white text-sm !mt-8 text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
              >
                Sign in here
              </a>
            </p>
          </form>

          {/* Display Status Message */}
          <p className="text-white text-center mt-4">{statusMessage}</p>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
