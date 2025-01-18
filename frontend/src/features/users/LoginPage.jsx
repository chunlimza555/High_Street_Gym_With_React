import { useState } from "react";
import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import { useAuth } from "../../hooks/authentication";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const [statusMessage, setStatusMessage] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, 
        }));
    }

    function handleCheckboxChange(e) {
        setRememberMe(e.target.checked);
    }

    function onLogin(e) {
        e.preventDefault();
        setStatusMessage("Logging in...");

        login(formData.email, formData.password)
            .then(() => {
                setStatusMessage("Signed in successfully" , formData);
                navigate("/");
            })
            .catch((error) => {
                setStatusMessage("Login failed: " + error.message);
            });
    }

    return (
        <>
            <Header />
            <div 
                className="flex justify-center items-center min-h-screen px-4 sm:px-0"
                style={{ 
                    backgroundImage: "url('/bg.jpg')", 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="bg-[#51a6d3] bg-opacity-70 border border-slate-600 rounded-md p-6 sm:p-8 shadow-lg backdrop-filter backdrop-blur-lg relative w-full max-w-sm md:max-w-md">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white"> Login </h1>
                    <form onSubmit={onLogin}>
                        <div className="relative my-4">
                            <input 
                                type="email" 
                                id= "email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" " 
                                required
                            />
                            <label 
                                htmlFor="email" 
                                className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Email
                            </label>
                        </div>
                        <div className="relative my-4">
                            <input 
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label 
                                htmlFor="password" 
                                className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Password
                            </label>
                        </div>
                        <div className="flex items-center my-4">
                            <input 
                                type="checkbox" 
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={handleCheckboxChange}
                                className="mr-2 py-1"
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full text-white text-[18px] mt-4 mb-6 rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300"
                        >
                            Login
                        </button>
                        <p className="text-white text-sm text-center">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                            >
                                Register here
                            </a>
                        </p>
                    </form>
                    {statusMessage && <p className="text-red-500 mt-4 text-center">{statusMessage}</p>}
                </div>
            </div>
            <NavBottom />
        </>
    );
}
