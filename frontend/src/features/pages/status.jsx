import { useLocation, useNavigate } from "react-router-dom";

export default function StatusPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Access the error details passed through navigation state
    const { message = "Unknown error", code = 500 } = location.state || {};

    const goBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-600 text-white">
            <h1 className="text-3xl font-bold mb-4">Error {code}</h1>
            <p className="text-lg mb-8">{message}</p>
            <button
                onClick={goBack}
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Go Back
            </button>
        </div>
    );
}
