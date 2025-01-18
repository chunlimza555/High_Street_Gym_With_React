import express from "express"
import { getAllBlogs, getAllByUserID, getBlogbyID ,createnewBlog, UserBlogEdit, deleteBlog } from "../controllers/blog.js"
import auth from "../middleware/auth.js";

const BlogAPIRouter = express.Router();

// http://localhost:8080/blog
BlogAPIRouter.get("/" , getAllBlogs);


// http://localhost:8080/blog/bloguser/:userID
BlogAPIRouter.get("/bloguser/:userID", 
    auth(["admin", "trainer", "members"]), 
    getAllByUserID);

    
// http://localhost:8080/blog/createblog
BlogAPIRouter.post("/createblog", 
    auth(["admin", "trainer", "members"]), 
    createnewBlog);


// http://localhost:8080/blog/:id
BlogAPIRouter.patch("/:id", 
    auth(["admin", "trainer", "members"]), 
    UserBlogEdit);


// http://localhost:8080/blog/:id
BlogAPIRouter.delete("/:id", 
    auth(["admin", "trainer", "members"]), 
    deleteBlog);


// http://localhost:8080/blog/editblog/:id
BlogAPIRouter.get("/editblog/:id", 
    auth(["admin", "trainer", "members"]), 
    getBlogbyID);


export default BlogAPIRouter    