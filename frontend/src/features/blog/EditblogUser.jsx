import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import BlogNav from "../../common/blog/Blognav";
import { useAuth } from "../../hooks/authentication";
import { updateBlog, getBlogbyID } from "../../api/blog";

export default function EditblogUser() {
  const { authenticatedUser } = useAuth();
  const navigate = useNavigate();
  const { blogID } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    user_id: "", 
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch existing blog data
  useEffect(() => {
    if (authenticatedUser && blogID) {
      getBlogbyID(authenticatedUser.authentication_key, blogID)
        .then((blog) => {
          if (blog.id === authenticatedUser.id) {
            setFormData({
              title: blog.title,
              post: blog.content,
              user_id: authenticatedUser.id,
            });
          } else {
            setErrorMessage("You are not authorized to edit this blog.");
            navigate("/blog");
          }
        })
        .catch(() => {
          setErrorMessage("Failed to load blog data.");
        });
    }
  }, [authenticatedUser, blogID, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for updating the blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateBlog(authenticatedUser.authentication_key, { ...formData, blog_id: blogID });
      if (response.status === 200) {
        navigate(`/bloguser/${authenticatedUser.id}`);
      } else {
        setErrorMessage(response.message || "Failed to update blog");
      }
    } catch {
      setErrorMessage("An error occurred while updating the blog.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <BlogNav />
        </div>
        <div className="w-full max-w-xs sm:max-w-md">
          <div className="p-8 rounded-2xl bg-black shadow">
            <h2 className="text-white text-center text-2xl font-bold">Edit Blog</h2>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-white text-sm mb-2 block">Blog Title</label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full text-white text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Blog Post</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  className="w-full text-white text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                  placeholder="Enter blog content"
                />
              </div>

              {errorMessage && <div className="text-red-500">{errorMessage}</div>}

              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Update Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
