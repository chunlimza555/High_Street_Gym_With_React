import * as Users from "../models/users.js";

export default function api_auth(allowed_roles = []) {
    return async function (req, res, next) {
        const authentication_key = req.get("X-AUTH-KEY");
        console.log("Received authentication key:", authentication_key || "No key provided");

        if (!authentication_key) {
            return res.status(401).json({
                status: 401,
                message: "Authentication key is missing.",
            });
        }

        try {
            const user = await Users.getByAuthenticationKey(authentication_key);
            if (!user) {
                console.log("Invalid authentication key. No user found.");
                return res.status(401).json({
                    status: 401,
                    message: "Invalid authentication key.",
                });
            }

            console.log("Authenticated user:", user);

            // Check if the user's role is allowed
            if (allowed_roles.length > 0 && !allowed_roles.includes(user.role)) {
                console.log(`Access denied. Role '${user.role}' is not allowed.`);
                return res.status(403).json({
                    status: 403,
                    message: "Access forbidden. Role not permitted.",
                });
            }

            req.user = user; // Attach user to the request
            next(); // Move to the next middleware or route handler
        } catch (error) {
            console.error("Authentication error:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error.",
            });
        }
    };
}
