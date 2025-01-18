import { deleteBlog } from "../../api/blog"; 
import { useAuth } from "../../hooks/authentication"; 
import { useEffect, useState } from "react"; // For handling loading, errors, and re-fetching blogs
import { getAllByUserID } from "../../api/blog"; 
import { useNavigate } from "react-router-dom";

const Userblogcard = () => {
  const { authenticatedUser } = useAuth(); 
  const [blogs, setBlogs] = useState([]); 
  const [isDeleting, setIsDeleting] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  // Fetch user's blogs when the component mounts or after a blog is deleted
  const fetchBlogs = async () => {
    // to check if the auth user exist 
    try {
      const userBlogs = await getAllByUserID(authenticatedUser.authentication_key, authenticatedUser.id);
      setBlogs(userBlogs); // Set fetched blogs
      setLoading(false); // Stop loading
    } catch  {
      setErrorMessage("Failed to load blogs."); // Handle fetch error
      setLoading(false);
    }
  };

  // Handle delete blog action
  const handleDelete = async (blogID) => {
    setIsDeleting(true);
    try {
      await deleteBlog(authenticatedUser.authentication_key, blogID); 
      await fetchBlogs(); 
    } catch  {
      setErrorMessage("Failed to delete the blog."); 
    }
    setIsDeleting(false);
  };

  // Fetch blogs when the component mounts
  useEffect(() => {
    if (authenticatedUser) {
      fetchBlogs(); 
    }
  }, [authenticatedUser]);

  if (loading) {
    return <p>Loading your blogs...</p>; // Display loading message while fetching data
  }

  return (
    <>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div
            key={blog.id}
            className="card bg-[#f5f5f5] text-primary-content w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto px-4"
          >
            <div className="card-body flex flex-col items-center">
              <h2 className="card-title text-center text-lg font-bold">{blog.post_title}</h2>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="truncate w-full text-center">
                  Posted by <span className="break-words">{blog.user_firstname} {blog.user_lastname}</span>
                </p>
                <p>Date Posted: {new Date(blog.post_datetime).toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <p className="break-words max-w-xs px-4 text-center">{blog.post_content}</p>
              </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              
              <div className="flex gap-4 mt-4">

                
                <button 
                  className="btn btn-secondary font-bold bg-[#e0ef59] text-black border-yellow-300"
                  onClick={() => {
                    console.log(`Navigating to /blogedit/${blog.post_id}`); // Debug log
                    navigate(`/blogedit/${blog.post_id}`);
                  }}>
                  Edit
                </button>
                <button className="btn btn-error font-bold" onClick={() => handleDelete(blog.post_id)} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-black">No blogs found.</p> 
      )}
    </>
  );
};

export default Userblogcard;
