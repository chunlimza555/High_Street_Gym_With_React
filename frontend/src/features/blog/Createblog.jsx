import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import BlogNav from "../../common/blog/Blognav";
import { createnewBlog } from "../../api/blog";
import { useAuth } from "../../hooks/authentication";

export default function Createblog() {
  const { authenticatedUser } = useAuth(); // To get the authenticated user
  const navigate = useNavigate(); // Routing purpose
  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
    content: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // useEffect to set user_id after authenticatedUser is available
  useEffect(() => {
    if (authenticatedUser && authenticatedUser.id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user_id: authenticatedUser.id, // Use user_id
      }));
    }
  }, [authenticatedUser]);

  // To Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // To Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_id) {
      setErrorMessage("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await createnewBlog(
        authenticatedUser.authentication_key,
        formData
      );
      if (response.status === 200) {
        setSuccessMessage("Blog created successfully!"); // Set success message
        // Optionally, you can navigate after showing the success message
        // navigate(`/bloguser/${authenticatedUser.id}`);
      } else {
        setErrorMessage(response.message || "Failed to create blog");
      }
    } catch {
      setErrorMessage("An error occurred while creating the blog.");
    }
  };

  return (
    <>
      <Header />

      <div
        className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{
          backgroundColor: "#ffff", // Ensure the correct path to the background image
          backgroundSize: "cover",           // Cover the entire background
          backgroundPosition: "center",      // Center the background image
          backgroundRepeat: "no-repeat",     // Prevent repeating
          backgroundAttachment: "fixed",     // Keeps the background fixed while scrolling
          minHeight: "100vh",                // Ensures the background covers the full viewport height
        }}
      >
        <div className="w-full max-w-xs sm:max-w-md bg-[#53a6f4] bg-opacity-80 p-8 rounded-lg shadow-lg">
          <BlogNav />
          <h2 className="text-black text-center text-2xl font-bold">Create Blog</h2>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-black text-sm mb-2 block">Blog Title</label>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full text-black bg-[#f5f5f5] text-sm border border-black px-4 py-3 rounded-md outline-blue-600"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className="text-black text-sm mb-2 block">Blog Post</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                className="w-full text-black bg-[#f5f5f5] text-sm border border-black px-4 py-3 rounded-md outline-blue-600"
                placeholder="Enter blog content"
              />
            </div>

            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            {successMessage && <div className="text-green-500">{successMessage}</div>}

            <div className="mt-8">
              <button type="submit" className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Create Blog
              </button>
            </div>
          </form>
        </div>
      </div>

      <NavBottom />
    </>
  );
}
