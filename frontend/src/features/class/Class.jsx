import { useState, useEffect } from "react";
import { getClassesByDate, getClassCalendarDefault } from "../../api/class";
import NavBottom from "../../common/NavBottom";
import Header from "../../common/Header";
import { useAuth } from "../../hooks/authentication";
import { Link, useNavigate } from "react-router-dom";

// Function to format the date and time for display
function formatDate(dateString) {
  const date = new Date(dateString); // Automatically adjusts based on local time zone
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const suffix = (day % 10 === 1 && day !== 11) ? 'st'
    : (day % 10 === 2 && day !== 12) ? 'nd'
    : (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
  return `${day}${suffix} ${month}`;
}

// Function to format the time
function formatTime(dateString) {
  const date = new Date(dateString.split('.')[0]); // Remove Z from the date string
  return date.toLocaleTimeString("en-AU", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // If you want AM/PM, set this to true
  });
}

export default function ClassCalendar() {
  const [locationId, setLocationId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [locations, setLocations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authenticatedUser } = useAuth();
  const navigate = useNavigate();

  // Fetch locations on component load
  useEffect(() => {
    if (authenticatedUser) {
      getClassCalendarDefault(authenticatedUser.authentication_key)
        .then((response) => {
          if (response && response.data && response.data.locations) {
            setLocations(response.data.locations);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch locations:", err);
          setError("Failed to fetch locations. Please try again.");
        });
    } else {
      navigate("/login"); // Redirect if user is not authenticated
    }
  }, [authenticatedUser, navigate]);

  // Fetch classes for the selected date
  const fetchClassesByDate = async () => {
    if (authenticatedUser && locationId) {
      try {
        setLoading(true);
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        const response = await getClassesByDate(
          authenticatedUser.authentication_key, 
          formattedDate, 
          locationId
        );

        if (response && response.data && response.data.classes) {
          setClasses(response.data.classes);
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClassesByDate();
  };

  return (
    <>
      <Header />
      <div className="min-h-screen text-black bg-cover bg-center flex flex-col items-center py-10 bg-[#ffff]">
        <div className="bg-[#6cb1e6] rounded-lg p-6 w-full max-w-4xl bg-opacity-80 backdrop-blur-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Class Calendar</h1>

          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            {/* Location Select */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Choose a Location:</span>
              </label>
              <select
                className="select select-bordered bg-white"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Dropdown */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black font-semibold">Choose a Date:</span>
              </label>
              <select
                className="select select-bordered bg-white"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              >
                <option value="">Select Date</option>
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const formattedDate = date.toISOString().split('T')[0]; 
                  return (
                    <option key={i} value={formattedDate}>
                      {formatDate(date)}
                    </option>
                  );
                })}
              </select>
            </div>

            <button type="submit" className="btn bg-blue-600 text-white hover:bg-blue-500">
              View Available Classes
            </button>
          </form>

          {/* Classes List */}
          <h2 className="text-xl font-semibold mt-8 text-center">Available Classes</h2>
          {loading && <p>Loading classes...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
            {classes.length > 0 ? (
              classes.map((classItem, index) => (
                <div key={classItem.class_id} className="border font-semibold text-white border-black bg-[#0e81b6] w-full rounded-lg p-4 shadow-md flex justify-between items-center">
                  <div>
                    <p><strong>Class name:</strong> {classItem.activity_name}</p>
                    <p><strong>Date:</strong> {classItem.class_date}</p>
                    <p><strong>Time:</strong> {classItem.class_time}</p>
                    <p><strong>Location:</strong> {classItem.location_name}</p>
                  </div>
                  <Link
                    to={`/book_class/${classItem.class_id}/${classItem.class_datetime.split('T')[0]}`}
                    className="border text-white font-bold border-black px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
                  >
                    Booking
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center font-semibold text-red-500">No classes available for this location and date.</p>
            )}
          </div>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
