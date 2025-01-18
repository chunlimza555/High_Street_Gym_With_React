    import { Router } from "express";
    import * as Blog from "../models/blog_posts.js"
    import * as BlogUser from "../models/blog-user.js"
    import validator from "validator"


    const blogController = Router();

    /**
     * Controller to get all blogs with user information
     * @param {*} req 
     * @param {*} res 
     */
    export function getAllBlogs(req, res) {
        BlogUser.getAll()
            .then(blogs => {
                return res.status(200).json(blogs);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                return res.status(500).json({ status: 500, message: 'Failed to fetch blogs' });
            });
    }


    export function getAllByUserID (req, res) {
        const userID = req.params.userID;
        
        if(userID) {
            BlogUser.getAllByUserID(userID)
            .then(blogs => {
            return res.status(200).json(blogs); // Return all blogs and user information
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                return res.status(500).json({ status: 500, message: 'Failed to fetch blogs' });
            })
        }
    }

    export function getBlogbyID(req, res) {
        const blogID = req.params.id;
        
    
        if (blogID) {
            BlogUser.getAllByBlogID(blogID) 
                .then(blog => {
                    return res.status(200).json(blog); 
                })
                .catch(error => {
                    console.error('Error fetching blog:', error); // Log the exact error
                    return res.status(500).json({ status: 500, message: 'Failed to fetch blog' });
                });
        } else {
            return res.status(400).json({ status: 400, message: 'Blog ID is required' });
        }
    }


    export function createnewBlog(req, res) {
        const blogform = req.body;
        
        // console.log("Received blog form data:", blogform); // Log form data
        // console.log("Authenticated user from request:", req.user); // Log the authenticated user attached by the middleware
    
        // Validation
        if (!blogform.user_id) {
            console.log("User ID missing in form data."); // Log if user ID is missing
            return res.status(400).json({
                status: 400,
                message: "User ID is required.",
            });
        }
    
        // Log validation steps
        if (!/[a-zA-Z-]{2,}/.test(blogform.title)) {
            console.log("Invalid blog title."); // Log if the title validation fails
            return res.status(400).json({
                status: 400,
                message: "Blog title must contain only letters and be at least 2 characters long.",
            });
        }
        
        
        // Continue with the creation logic
        const newBlog = Blog.newBlog(
            null,
            blogform.user_id,
            validator.escape(blogform.title),
            (new Date().toISOString().slice(0, 19).replace('T', ' ')),
            validator.escape(blogform.content)
        );
    
        Blog.createBlog(newBlog)
            .then(result => {
                console.log("Blog created successfully:", result); // Log success
                return res.status(200).json({
                    status: 200,
                    message: "Blog created successfully",
                    result: result
                });
            })
            .catch(error => {
                console.error("Error creating blog:", error); // Log errors during creation
                return res.status(500).json({
                    status: 500,
                    message: "Failed to create blog"
                });
            });
    }
    
    

    // export function createnewBlog(req, res) {
    //     const blogform = req.body;

    //     // Check if user_id exists
    //     if (!blogform.user_id) {
    //         return res.status(400).json({
    //             status: 400,
    //             message: "User ID is required",
    //         });
    //     }

    //     // Validate blog title
    //     if (!/[a-zA-Z-]{2,}/.test(blogform.title)) {
    //         return res.status(400).json({
    //             status: 400,
    //             message: "Blog title must contain only letters and be at least 2 characters long",
    //         });
    //     }

    //     // Validate blog post
    //     if (!/[a-zA-Z-]{2,}/.test(blogform.content)) {
    //         return res.status(400).json({
    //             status: 400,
    //             message: "Blog post must contain only letters and be at least 2 characters long",
    //         });
    //     }

    //     // Create a new blog object
    //     const newBlog = Blog.newBlog(
    //         null,
    //         blogform.user_id,
    //         validator.escape(blogform.title),
    //         new Date().toISOString().slice(0, 19).replace('T', ' '), // Blog date
    //         validator.escape(blogform.content),
            
    //     );

    //     // Insert the new blog into the database
    //     Blog.createBlog(newBlog)
    //         .then(result => {
    //             return res.status(200).json({
    //                 status: 200,
    //                 message: "Blog created successfully",
    //                 result: result // Return the created blog result
    //             });
    //         })
    //         .catch(error => {
    //             console.error("Error creating blog:", error);
    //             return res.status(500).json({
    //                 status: 500,
    //                 message: "Failed to create blog"
    //             });
    //         });
    // }

    // PATCH - Update Blog
    export function UserBlogEdit(req, res) {
    const formData = req.body;
    const blogID = req.params.id;  // Capture the blog ID from the URL params

    // Validation
    if (typeof formData.title !== 'string' || !/[a-zA-Z-]{2,}/.test(formData.title)) {
        return res.status(400).json({
            status: 400,
            message: "Blog title must contain only letters and hyphens, and be at least 2 characters long."
        });
    }

    if (typeof formData.content !== 'string' || !/[a-zA-Z-]{2,}/.test(formData.content)) {
        return res.status(400).json({
            status: 400,
            message: "Blog post must contain only letters and hyphens, and be at least 2 characters long."
        });
    }

    // Ensure that the IDs are treated as strings and pass the blogID from params
    const editBlog = Blog.newBlog(
        blogID,  // Use the blog ID captured from URL params
        validator.escape(String(formData.user_id)), // Ensure user_id is a string
        validator.escape(formData.title),
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        validator.escape(formData.content)
    );

    Blog.updateBlog(editBlog)  // Make sure the function uses blogID correctly
        .then(result => {
            return res.status(200).json({
                status: 200,
                message: "Blog updated successfully",
                result: result
            });
        })
        .catch(error => {
            console.error("Error updating blog:", error);
            return res.status(500).json({
                status: 500,
                message: "Failed to update blog"
            });
        });
}

    // DELETE - Delete Blog
   
    export function deleteBlog(req, res) {
        const blogID = req.params.id;  // Extract blogID from URL params
        
        if (!blogID || isNaN(blogID)) {
            return res.status(400).json({ status: 400, message: "Invalid blog ID" });
        }

        Blog.deleteBlog(blogID)  // Ensure blogID is passed to the model function
            .then(result => {
                return res.status(200).json({ status: 200, message: "Blog deleted successfully" });
            })
            .catch(error => {
                console.error("Error deleting blog:", error);
                return res.status(500).json({ status: 500, message: "Failed to delete blog" });
            });
    }

export default blogController