import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import * as Users from "../models/users.js";
import validator from "validator";

const userController = Router();

/**
 * POST /api/users/login
 *
 * Header: Authentication key should have a uuid of a loggen in user
 * @param {*} req
 * @param {*} res
 */

export function loginUser(req, res) {
  console.log("Login request body:", req.body); // Add this to inspect incoming body

  // access to request body
  let loginData = req.body;
  console.log("Login data:", loginData);
  //validation for email before login

  const emailvalidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;  // Added 'i' flag to make it case-insensitive
if (!emailvalidation.test(loginData.email)) {
  return res.status(400).json({
    status: 400,
    message: "Please enter a valid email address.",
  });
}

  Users.getByEmail(loginData.email)
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }

      // Check if the password matches
      if (bcrypt.compareSync(loginData.password, user.password)) {
        user.authentication_key = uuid4().toString(); // Ensure this is properly set

        console.log("Returning authentication key:", user.authentication_key);

        Users.updateUser(user).then(() => {
          // Return user with authentication key and role
          return res.status(200).json({
            status: 200,
            message: "User logged in",
            authentication_key: user.authentication_key,
            role: user.role, // user role included in response so navbar work based on the roles
          });
        });
      } else {
        return res
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      return res.status(500).json({ status: 500, message: "Login failed" });
    });
}

export function logoutUser(req, res) {
  const authentication_key = req.get("X-AUTH-KEY");

  console.log("Authentication key received:", authentication_key);
  console.log("Request headers:", req.headers);  // Log all headers

  if (!authentication_key) {
    return res.status(400).json({
      status: 400,
      message: "Authentication key is required for logout",
    });
  }

  Users.getByAuthenticationKey(authentication_key)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      user.user_authentication_key = null;

      Users.updateUser(user).then((result) => {
        res.status(200).json({
          status: 200,
          message: "User logged out",
        });
      });
    })
    .catch((error) => {
      console.error("Error during logout:", error);
      res.status(500).json({
        status: 500,
        message: "Logout failed",
      });
    });
}



// In your controllers/users.js


export function getUserByAuthKey(req, res) {
  const authKey = req.get("X-AUTH-KEY"); 
  console.log("Authentication Key received from request:", authKey); // Log the authentication key received from the client

  if (!authKey) {
      console.log("No authentication key provided."); // Log missing key
      return res.status(400).json({ message: "Authentication key is required" });
  }

  Users.getByAuthenticationKey(authKey)
      .then((user) => {
          if (!user) {
              console.log("No user found for this authentication key."); // Log missing user
              return res.status(404).json({ message: "User not found" });
          }

          // Debugging the user object
          console.log("User found:", user);
          console.log("User role:", user.role);

          res.json({
              status: 200,
              role: user.role,
              user: user, // Include the full user object for the frontend
          });
      })
      .catch((err) => {
          console.error("Error retrieving user:", err); // Log errors
          res.status(500).json({ message: "Server error" });
      });
}


// export function getUserByAuthKey(req, res) {
//   const authKey = req.get("X-AUTH-KEY"); // Get the authentication key from the headers

//   if (!authKey) {
//     return res.status(400).json({ message: "Authentication key is required" });
//   }

//   Users.getByAuthenticationKey(authKey)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // debugging the user object
//       console.log("User found:", user);
//       console.log("User role:", user.user_role);

//       res.json({
//         status: 200,
//         role: user.user_role,
//         user: user, // Include the full user object for the frontend, make sure it includes `id`
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     });
// }

/**
 * POST for /users/register
 * @param {*} req
 * @param {*} res
 * @returns
 */
export function registerUser(req, res) {
  console.log("Register route accessed");
  const userData = req.body;
  console.log("User data from request:", userData);

  // Email validation
  if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(userData.email)) {
    return res.status(400).json({
      status: "Invalid email",
      message: "Email must be a valid email address.",
    });
  }

  // Phone validation
  if (!/^[0-9]{10}$/.test(userData.phone)) {
    return res.status(400).json({
      status: "Invalid phone number",
      message: "Phone number must be 10 digits.",
    });
  }

  // First name validation
  if (!/^[a-zA-Z-]{2,}$/.test(userData.firstname)) {
    return res.status(400).json({
      status: "Invalid first name",
      message: "First name must be letters.",
    });
  }

  // Last name validation
  if (!/^[a-zA-Z-]{2,}$/.test(userData.lastname)) {
    return res.status(400).json({
      status: "Invalid last name",
      message: "Last name must be letters.",
    });
  }

  // Hash the password
  userData.user_password = bcrypt.hashSync(userData.password);

  // Create the user object
  const user = Users.newUser(
    null,
    userData.email,
    userData.user_password,  // Use hashed password
    "members",
    userData.phone,
    userData.firstname,
    userData.lastname,
    userData.address,
    uuid4()  // Generate a new authentication key using uuidv4
  );
  console.log("User object passed to createUser:", user);

  // Create the user in the database
  Users.createUser(user)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "User has been created",
        user: user,
      });
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      res.status(500).json({
        status: 500,
        message: "Registration failed",
      });
    });
}



// PATCH for user
export function UpdateUser(req, res) {
  const userData = req.body;
  const authKey = req.get("X-AUTH-KEY");

  console.log("Received data for updating user:", userData);
  console.log("Authentication key from request:", authKey);

  if (!authKey) {
    return res.status(400).json({
      status: 400,
      message: "Authentication key is required",
    });
  }

  // Input Validation
  if (
    !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(userData.email)
  ) {
    return res.status(400).json({
      status: "Invalid email",
      message: "Email must be a valid email address.",
    });
  }

  if (!/^[0-9]{10}$/.test(userData.phone)) {
    return res.status(400).json({
      status: "Invalid phone number",
      message: "Phone number must be 10 digits.",
    });
  }

  if (!/^[a-zA-Z-]{2,}$/.test(userData.firstname)) {
    return res.status(400).json({
      status: "Invalid first name",
      message: "First name must be at least 2 letters.",
    });
  }

  if (!/^[a-zA-Z-]{2,}$/.test(userData.lastname)) {
    return res.status(400).json({
      status: "Invalid last name",
      message: "Last name must be at least 2 letters.",
    });
  }

  // Get the authenticated user based on the provided auth key
  Users.getByAuthenticationKey(authKey)
    .then((authUser) => {
      if (!authUser) {
        return res.status(404).json({
          status: 404,
          message: "Authenticated user not found",
        });
      }

      console.log("Authenticated user:", authUser);

      // Retrieve the user being updated from the database
      Users.getUserById(userData.id).then((existingUser) => {
        if (!existingUser) {
          return res.status(404).json({
            status: 404,
            message: "User not found",
          });
        }

        console.log("Existing user data:", existingUser);

        // Role-based update logic
        if (
          (authUser.role === "members" || authUser.role === "trainer") &&
          authUser.id !== existingUser.id
        ) {
          return res.status(403).json({
            status: 403,
            message: "Members and trainers can only update their own profiles.",
          });
        }

        // Prevent members and trainers from changing their role
        if (userData.role && userData.role !== existingUser.role) {
          return res.status(403).json({
            status: 403,
            message: "Members and trainers cannot change their role.",
          });
        }

        // Hash password only if it’s changed and non-empty
        if (userData.password && userData.password !== existingUser.password) {
          console.log("Hashing new password");
          userData.password = bcrypt.hashSync(userData.password);
        } else {
          userData.password = existingUser.password; // Keep existing hashed password
        }

        const updatedUser = Users.newUser(
          String(userData.id),
          validator.escape(userData.email),
          userData.password,
          existingUser.role, // Keep existing role
          validator.escape(userData.phone),
          validator.escape(userData.firstname),
          validator.escape(userData.lastname),
          validator.escape(userData.address),
          existingUser.authentication_key // Maintain existing key
        );

        console.log("Updating user with data:", updatedUser);

        // Update user in the database
        Users.updateUser(updatedUser)
          .then((result) => {
            console.log("User successfully updated:", result);
            res.status(200).json({
              status: 200,
              message: "Profile successfully updated",
              result: result,
            });
          })
          .catch((error) => {
            console.error("Error during update:", error);
            res.status(500).json({
              status: 500,
              message: "Profile failed to update",
            });
          });
      });
    })
    .catch((error) => {
      console.error("Error retrieving authenticated user:", error);
      res.status(500).json({
        status: 500,
        message: "Error retrieving authenticated user",
      });
    });
}






// export function UpdateUser(req, res) {
//   const userData = req.body;

//   console.log("Received data for updating user:", userData); // Log received data for debugging

//   // Retrieve the existing user record to retain its roles
//   Users.getUserById(userData.id)
//     .then(existingUser => {
//       if (!existingUser) {
//         return res.status(404).json({ status: 404, message: "User not found" });
//       }

//       // Log existing user data
//       console.log("Existing user data:", existingUser);

//       // Only hash the password if it's different and non-empty
//       if (userData.password && userData.password !== existingUser.password) {
//         console.log("Hashing new password");
//         userData.password = bcrypt.hashSync(userData.password);
//       } else {
//         userData.password = existingUser.password; // Keep existing hashed password
//       }

//       const editUser = Users.newUser(
//         String(userData.id),
//         validator.escape(userData.email),
//         userData.password,
//         existingUser.role, // Maintain existing roles
//         validator.escape(userData.phone),
//         validator.escape(userData.firstname),
//         validator.escape(userData.lastname), 
//         validator.escape(userData.address),
//         existingUser.authentication_key // Maintain authentication key
//       );

//       // Log the constructed user data before updating
//       console.log("Updating user with data:", editUser);

//       Users.updateUser(editUser)
//         .then((result) => {
//           console.log("User successfully updated:", result);
//           res.status(200).json({
//             status: 200,
//             message: "Profile successfully updated",
//             result: result,
//           });
//         })
//         .catch((error) => {
//           console.error("Error during update:", error);
//           res.status(500).json({
//             status: 500,
//             message: "Profile failed to update",
//           });
//         });
//     })
//     .catch(error => {
//       console.error("Error retrieving user:", error);
//       return res.status(500).json({ status: 500, message: "Error retrieving user data" });
//     });
// }





// DELETE - Delete User


export default userController;
