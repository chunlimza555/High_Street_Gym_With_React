import { useRef, useState } from "react";
import { API_URL } from "../../api/api"; // Adjust API_URL as needed
import { useAuth } from "../../hooks/authentication"; // Use your authentication hook

export function XMLUploader({ onUploadSuccess, uploadUrl, disabled = false }) {
    const { authenticatedUser } = useAuth();  // Fetch authenticated user details
    const [statusMessage, setStatusMessage] = useState(""); // Manage status messages
    const uploadInputRef = useRef(null); // Reference for the file input

    function uploadFile(e) {
        e.preventDefault(); // Prevent form submission
    
        const file = uploadInputRef.current.files[0]; // Get the selected file
        const formData = new FormData(); // Create FormData
        formData.append("xml-file", file); // Attach the file
    
        // Make the fetch request
        fetch(API_URL + uploadUrl, {
            method: "POST",
            headers: {
                'X-AUTH-KEY': authenticatedUser.authentication_key, // Auth key
            },
            body: formData, // Send FormData as body
        })
        .then(res => res.json())
        .then(APIResponse => {
            setStatusMessage(APIResponse.message); // Show status message
            if (typeof onUploadSuccess === "function") onUploadSuccess(); // Handle success
        })
        .catch(error => {
            setStatusMessage("Upload failed - " + error); // Handle error
        });
    }
    
    return (
        <div>
            <form className="flex-grow m-4 max-w-2xl" onSubmit={uploadFile}>
                <div className="form-control">
                    <label className="label bg-white m-3 w-fit border-1 ">
                        <span className="label-text text-black font-bold">XML File Import</span>
                    </label>
                    <div className="flex gap-2 flex-col md:flex-row items-center">
                        <input
                            ref={uploadInputRef} // Connect input to ref
                            type="file"
                            disabled={disabled} // Disable if needed
                            className="file-input file-input-bordered bg-[#dca4a4] font-bold file-input-primary w-full md:w-auto" 
                        />
                        <button 
                            disabled={disabled} 
                            className="btn bg-[#138cce] mt-2 md:mt-0 text-black hover:bg-[#0f72b0] disabled:bg-[#5699bd] disabled:text-white disabled:cursor-not-allowed"
                        >
                            Upload
                        </button>
                    </div>
                    <label className="label bg-slate-100">
                        <span className="label-text-alt text-green-500 font-bold">{statusMessage}</span> {/* Changed to green */}
                    </label>
                </div>
            </form>
        </div>
    );
}
