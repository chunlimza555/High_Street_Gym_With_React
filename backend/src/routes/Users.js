import express from "express";
import { loginUser, logoutUser, getUserByAuthKey, registerUser, UpdateUser } from "../controllers/users.js"; // Import the new controller
import auth from "../middleware/auth.js";


const UsersAPiRouter = express.Router();

/**
 * POST /users/login
 */
UsersAPiRouter.post("/login", loginUser);

/**
 * POST /users/register
 */

UsersAPiRouter.post("/register", registerUser )


/**
 * POST /users/logout
 */
UsersAPiRouter.post("/logout", logoutUser);

/**
 * GET /users/getByAuthenticationKey
 */
UsersAPiRouter.get("/getByAuthenticationKey/", getUserByAuthKey);

/**
 * PATCH /users/profile/:id
 */
UsersAPiRouter.patch("/profile/:id", 
    auth(["admin", "trainer", "members"])
    , UpdateUser);


export default UsersAPiRouter;
