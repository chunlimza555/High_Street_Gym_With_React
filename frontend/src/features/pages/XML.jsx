import { useState, useEffect } from "react";
import StaffNavBottom from "../../common/NavBottom";
import Header from "../../common/Header";
import { XMLUploader } from "../xml/XMLUploader";
import { getAllActivities, getAllLocations } from "../../api/class";

export default function XMLPages() {
    const [selectedOption, setSelectedOption] = useState(""); // Empty by default, meaning nothing is selected initially
    const [activities, setActivities] = useState([]);
    const [locations, setLocations] = useState([]);

    // Function to re-fetch data after a successful upload
    const handleUploadSuccess = () => {
        console.log("Upload success, refreshing data...");
        if (selectedOption === "activity") {
            fetchActivities();
        } else if (selectedOption === "location") {
            fetchLocations();
        }
    };

    // Fetch activities or locations when the user selects an option
    useEffect(() => {
        if (selectedOption === "activity") {
            fetchActivities();
        } else if (selectedOption === "location") {
            fetchLocations();
        }
    }, [selectedOption]);

    // Function to fetch activities
    async function fetchActivities() {
        const activityResponse = await getAllActivities();
        setActivities(activityResponse);
    }

    // Function to fetch locations
    async function fetchLocations() {
        const locationResponse = await getAllLocations();
        setLocations(locationResponse);
    }

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    return (
        <>
            <Header />

            
            <div
                className="min-h-screen text-black bg-cover bg-center flex flex-col items-center py-10 bg-[#ffff]" > 
                {/* Dropdown */}
                <div className="w-full max-w-md bg-[#6cb1e6] p-4 rounded-lg shadow-lg m-2">
                    <label className="block mb-2 text-m font-bold text-center ">
                        Select Option
                    </label>
                    <select
                        value={selectedOption}
                        onChange={handleOptionChange}
                        className="select select-bordered w-full bg-slate-500 p-2"
                    >
                        <option value="" disabled>-- Please Select --</option>
                        <option value="activity">Activity</option>
                        <option value="location">Location</option>
                    </select>
                </div>

                {/* XML Uploader */}
                {selectedOption && (
                    <div className="w-full max-w-md  p-4 rounded-lg shadow-lg m-7 bg-[#6cb1e6] ">
                        <XMLUploader
                            uploadUrl={selectedOption === "activity" ? "/activity/upload-xml" : "/location/upload-xml"}
                            onUploadSuccess={handleUploadSuccess} 
                        />
                    </div>
                )}

                {/* Conditionally render the list based on the selection */}
                <div className="w-full max-w-md overflow-x-auto "> {/* Added overflow-x-auto to handle table responsiveness */}
                    {selectedOption === "activity" && activities.length > 0 && (
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-4">Activity List</h2>
                            <table className="table-auto w-full text-white rounded-lg mb-24 ">
                                <thead className="text-white ">
                                    <tr>
                                        <th className="px-4 py-2 text-center">ID</th>
                                        <th className="px-4 py-2 text-center">Activity Name</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {activities.map((activity) => (
                                        <tr key={activity.activity_id} className="border-b ">
                                            <td className="px-4 py-2 text-center">{activity.activity_id}</td>
                                            <td className="px-4 py-2 text-center">{activity.activity_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {selectedOption === "location" && locations.length > 0 && (
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-4">Location List</h2>
                            <table className="table-auto w-full text-white rounded-lg mb-24">
                                <thead className="text-white">
                                    <tr>
                                        <th className="px-4 py-2 text-center">ID</th>
                                        <th className="px-4 py-2 text-center">Location Name</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {locations.map((location) => (
                                        <tr key={location.location_id} className="border-b ">
                                            <td className="px-4 py-2 text-center">{location.location_id}</td>
                                            <td className="px-4 py-2 text-center">{location.location_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <StaffNavBottom />
        </>
    );
}
