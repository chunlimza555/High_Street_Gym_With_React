import { useEffect, useState } from "react";
import { getAllBlog } from "../../api/blog"; // Assuming you have an API file for fetching blogs

const Allblogcard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogData = await getAllBlog();
        if (Array.isArray(blogData)) {
          setBlogs(blogData);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (error) {
        setError("Failed to load blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-4 p-4 mb-24">
      {blogs.length > 0 ? (
        blogs.map((blog, index) => (
          <div
            key={blog.post_id || index}
            className="card bg-[#f5f5f5] text-primary-content w-full max-w-md mx-auto px-4"
          >
            <div className="card-body text-center">
              <h2 className="card-title text-lg font-bold text-center">
                {blog.post_title || "Untitled Blog"}
              </h2>
              <p>Posted by {blog.user_firstname || "Unknown"} {blog.user_lastname || "Author"}</p>
              <p>Date Posted: {blog.post_datetime ? new Date(blog.post_datetime).toLocaleDateString() : "Date not available"}</p>
              <p>{blog.post_content || "No content available."}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
};

export default Allblogcard;
