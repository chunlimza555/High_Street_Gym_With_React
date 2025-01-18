import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/authentication";
import { useEffect } from "react";

const BlogNav = () => {
    const { authenticatedUser } = useAuth();  // Get authenticated user and their role

    // Log the authenticated user and role 
    useEffect(() => {
    }, [authenticatedUser]);

    // Safely access user role or set it to null if authenticated user is undefined
    const userRole = authenticatedUser && authenticatedUser.role ? authenticatedUser.role: null;  

    return (
        <div className="flex justify-around text-primary-content py-2 rounded-lg mb-4 gap"> {/* Adjusted colors */}
            {authenticatedUser && (userRole === "members" || userRole === "trainer" || userRole === "admin") && (
                <>
                    <Link
                        to="/blog"
                        className="flex flex-col items-center bg-[#f5f5f5] justify-center w-full py-2 hover:bg-opacity-90 mx-2 rounded-lg"  
                    >
                        <span className="text-center font-semibold">View All</span>
                    </Link>
                    <Link
                        to="/createblog"
                        className="flex flex-col items-center bg-[#f5f5f5] justify-center w-full py-2 hover:bg-opacity-90 mx-2 rounded-lg"  
                    >
                        <span className="text-center font-semibold">Create Blog</span>
                    </Link>
                    <Link
                        to={`/bloguser/${authenticatedUser.user_id}`}
                        className="flex flex-col items-center bg-[#f5f5f5] justify-center w-full py-2 hover:bg-opacity-90 mx-2 rounded-lg"  
                    >
                        <span className="text-center font-semibold">Your Posts</span>
                    </Link>
                </>
            )}
        </div>
    );
};

export default BlogNav;
