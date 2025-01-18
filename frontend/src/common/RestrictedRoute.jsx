import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authentication";
import NavBottom from "./NavBottom";
import Header from "./Header";

export function RestrictedRoute({ allowedRoles = [], children }) {
    const { authenticatedUser } = useAuth(); // Use the correct structure
    const navigate = useNavigate();

    // Check if the user's role matches one of the allowed roles
    const userIsAuthorised = authenticatedUser && allowedRoles.includes(authenticatedUser.role);

    return userIsAuthorised
        ? children // If user is authorized, show the children components (protected content)
        : (
            <>
                <Header />
                <div className="flex flex-col justify-center items-center gap-4 bg-gray-800 min-h-screen">
                    <h2 className="text-4xl">Not Authorised</h2>
                    <span className="text-xl text-center">Access role is not permitted to view this page.</span>
                    <button className="btn btn-lg text-white bg-black" onClick={() => navigate(-1)}>Back</button>
                </div>
                <NavBottom />
            </>
        );
}
