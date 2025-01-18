import { createContext, useContext, useState, useEffect } from "react";
import * as Users from "../api/users";

export const AuthContext = createContext(null);

export function AuthProvider({ router, children }) {
    const [authenticatedUser, setAuthenticatedUser] = useState(null);

    useEffect(() => {
        if (authenticatedUser == null) {
            const authentication_key = localStorage.getItem("authentication_key");
            if (authentication_key) {
                Users.getByAuthenticationKey(authentication_key)
                    .then(response => {
                        console.log("User fetched on page reload: ", response.role); // Log user data to debug
                        setAuthenticatedUser(response); // Set authenticated user correctly
                    })
                    .catch(error => {
                        console.error("Error fetching user:", error);
                        // Uncomment if you want to redirect when no user found
                        // router.navigate("/login");
                    });
            } else {
                // Uncomment if you want to redirect when no auth key is found
                // router.navigate("/login");
            }
        }
    }, [authenticatedUser]); // Ensure this useEffect runs when authenticatedUser changes

    return (
        <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
            {children}
        </AuthContext.Provider>
    );
}
``
export function useAuth() {
    const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
    console.log("User: ", authenticatedUser);
    async function login(email, password) {
        return Users.loginUser(email, password)
            
            .then(result => {
                if (result.status === 200) {
                    localStorage.setItem("authentication_key", result.authentication_key);
                    return Users.getByAuthenticationKey(result.authentication_key)
                        .then(user => {
                            setAuthenticatedUser(user);
                            return Promise.resolve(result.message);
                        });
                } else {
                    return Promise.reject(result.message);
                }
            })
            .catch(error => {
                return Promise.reject(error.message || "An error occurred during login");
            });
    }


    async function logout() {
        localStorage.removeItem("authentication_key");

        if (authenticatedUser) {
            return Users.logout(authenticatedUser.authentication_key)
                .then(result => {
                    setAuthenticatedUser(null);
                    return Promise.resolve(result.message);
                })
                .catch(error => {
                    return Promise.reject(error.message || "An error occurred during logout");
                });
        } else {
            return Promise.reject("No user is authenticated");
        }
    }

    async function refresh() {
        if (authenticatedUser) {
            return Users.getByAuthenticationKey(authenticatedUser.authentication_key)
                .then(user => {
                    setAuthenticatedUser(user);
                    return Promise.resolve("User refreshed");
                })
                .catch(error => {
                    return Promise.reject(error.message || "An error occurred during refresh");
                });
        } else {
            return Promise.reject("User must be authenticated");
        }
    }

    return { authenticatedUser, setAuthenticatedUser ,login, logout, refresh }; // Return as an object
}
