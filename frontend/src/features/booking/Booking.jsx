import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { getClassDetails, finalizeBooking, checkDuplicateBooking } from "../../api/booking"; 
import { useAuth } from "../../hooks/authentication";
import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";

// Helper function to format the date in "1st January", "2nd February" format
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });

  const suffix = (day % 10 === 1 && day !== 11) ? 'st'
    : (day % 10 === 2 && day !== 12) ? 'nd'
    : (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

  return `${day}${suffix} ${month}`;
}

// Helper function to format the time in "hh:mm AM/PM" format
function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12;
  const displayHours = formattedHours === 0 ? 12 : formattedHours;
  return `${displayHours}:${minutes} ${ampm}`;
}

export default function Booking() {
  const { class_id, date } = useParams();
  const { authenticatedUser: AuthUser } = useAuth();
  const [classDetails, setClassDetails] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false); // Track duplicate booking
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthUser && class_id) {
      // Fetch class details and trainers
      getClassDetails(class_id, AuthUser.authentication_key)
        .then((response) => {
          setClassDetails(response.data.classDetails);
          setTrainers(response.data.trainers);

          // Check if the user has already booked this class
          return checkDuplicateBooking(AuthUser.id, class_id, AuthUser.authentication_key);
        })
        .then((isBooked) => {
          setIsDuplicate(isBooked); // Set duplicate flag if already booked
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [AuthUser, class_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDuplicate) {
      alert("You have already booked this class.");
      return;
    }

    // Proceed with booking if no duplicate found
    finalizeBooking(class_id, selectedTrainer, AuthUser.authentication_key)
      .then(() => navigate("/userbooking"))
      .catch((error) => console.error("Booking failed:", error));
  };

  if (!AuthUser) return <p>Loading user details...</p>;
  if (!classDetails) return <p>Loading class details...</p>;

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col items-center justify-center py-10"
        style={{
          backgroundColor: '#ffff',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-[#6cb1e6] shadow-md rounded-lg p-8 w-full max-w-3xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-[#121010]">
            {classDetails.activity_name}
          </h1>

          <div className="flex flex-col items-center gap-4 text-[#121010]">
            <p className="text-lg">
              <strong>Date:</strong> {formatDate(classDetails.class_datetime)}
            </p>
            <p className="text-lg">
              <strong>Time:</strong> {formatTime(classDetails.class_datetime)}
            </p>
            <p className="text-lg">
              <strong>Location:</strong> {classDetails.location_name}
            </p>
            <p className="text-lg">
              <strong>Duration:</strong> {classDetails.activity_duration} minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6 items-center">
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="bg-white text-[#121010] border border-gray-300 rounded-lg w-full max-w-md"
              required
            >
              <option value="" disabled>Select a Trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer.trainer_id} value={trainer.trainer_id}>
                  {trainer.trainer_name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-[#ffff] text-[#121010] font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-[#121010] hover:text-white max-w-md"
            >
              Book Class
            </button>
          </form>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
