import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/authentication";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/api";

import NavBottom from "../../common/NavBottom";
import Header from "../../common/Header";

export default function TrainerClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { authenticatedUser } = useAuth();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null); // Store selected class

  // Function to filter current and future classes
  const filterCurrentAndFutureClasses = (classList) => {
    const now = new Date(); // Get current date and time
    return classList.filter((classItem) => new Date(classItem.class_datetime) >= now);
  };

  useEffect(() => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/class/trainer`, {
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-KEY": authenticatedUser.authentication_key,
      },
    })
      .then((response) => {
        console.log("API Response:", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch classes. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Classes:", data);
        const filteredClasses = filterCurrentAndFutureClasses(data.data || []);
        setClasses(filteredClasses); // Set only current and future classes
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        setError("An error occurred. Please try again.");
        setLoading(false);
      });
  }, [authenticatedUser, navigate]);

  const openPopup = (classItem) => {
    setSelectedClass(classItem);
  };

  const closePopup = () => {
    setSelectedClass(null);
  };

  const confirmDeleteClass = () => {
    if (!selectedClass) return;

    fetch(`${API_URL}/class/${selectedClass.class_id}`, {
      method: "DELETE",
      headers: {
        "X-AUTH-KEY": authenticatedUser.authentication_key,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setClasses((prevClasses) =>
            prevClasses.filter((c) => c.class_id !== selectedClass.class_id)
          );
          closePopup();
        } else {
          alert(data.message || "Failed to delete class.");
        }
      })
      .catch((error) => {
        console.error("Error deleting class:", error);
        alert("An error occurred. Please try again.");
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <div className="p-4 flex justify-center min-h-screen bg-cover bg-center bg-[#ffff]" >
        <div className="w-full max-w-3xl bg-[#6cb1e6]">
          <h1 className="text-3xl font-bold mb-6 text-center text-black bg-white py-4 rounded-lg border-2 border-black">
            Your Classes
          </h1>

          {classes.length === 0 ? (
            <p className="text-center text-black">No classes available.</p>
          ) : (
            <div className="space-y-6 text-black">
              {classes.map((classItem) => (
                <div key={classItem.class_id} className="bg-white w-3/4 mx-auto shadow-md rounded-lg p-6">
                  <p className="text-lg font-semibold mb-2">
                    <strong>Class Name:</strong> {classItem.activity_name}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(classItem.class_datetime)}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(classItem.class_datetime)}
                  </p>
                  <p>
                    <strong>Location:</strong> {classItem.location_name}
                  </p>
                  <button
                    onClick={() => openPopup(classItem)}
                    className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancel Class
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Confirm Cancellation
            </h2>
            <p className="text-center mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-around">
              <button
                onClick={confirmDeleteClass}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Yes, Cancel
              </button>
              <button
                onClick={closePopup}
                className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                No, Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <NavBottom />
    </>
  );
}
