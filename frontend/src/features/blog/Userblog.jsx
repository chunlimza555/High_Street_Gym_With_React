import { useEffect, useState } from "react";
import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import BlogNav from "../../common/blog/Blognav";
import { getAllByUserID } from "../../api/blog";
import { useAuth } from "../../hooks/authentication";
import Userblogcard from "../../common/blog/Userblog";

export default function Userblog() {
  const { authenticatedUser } = useAuth(); // Get authenticated user info
  const [userBlogs, setUserBlogs] = useState([]); // Store fetched blogs
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error handling

  useEffect(() => {
    if (authenticatedUser) {
      // Fetch the blogs by user ID
      getAllByUserID(authenticatedUser.authentication_key, authenticatedUser.id)
        .then((blogs) => {
          setUserBlogs(blogs); // Fetched blogs
          setLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error("Error fetching user blogs:", error);
          setErrorMessage("Failed to load blogs."); // Handle errors
          setLoading(false); // Stop loading
        });
    }
  }, [authenticatedUser]);

  return (
    <>
      <Header /> {/* Display header */}
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          backgroundColor: "#ffff", // Use the correct path to your background image
          backgroundSize: "cover",           // Make sure the image covers the background
          backgroundPosition: "center",      // Center the background image
          backgroundRepeat: "no-repeat",     // Prevent repeating the image
          backgroundAttachment: "fixed",     // Keep the background fixed when scrolling
          minHeight: "100vh",                // Ensure the background covers the full viewport height
        }}
      >
        <div className="w-full max-w-4xl bg-opacity-80 p-6 rounded-lg shadow-lg bg-[#6cb1e6]">
          <BlogNav /> {/* Display blog navigation */}
          <div className="flex flex-col justify-center gap-4 p-4 mb-24">
            {loading ? (
              <p className="text-black">Loading your blogs...</p> 
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p> 
            ) : (
              <Userblogcard blogs={userBlogs} /> 
            )}
          </div>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
