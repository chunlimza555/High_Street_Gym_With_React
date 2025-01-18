import Header from "../../common/Header";
import NavBottom from "../../common/NavBottom";
import { useAuth } from "../../hooks/authentication";
import { getBookingByUserID, deleteBooking } from "../../api/booking";
import { useState, useEffect } from "react";

export default function UserBooking() {
  const { authenticatedUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingID, setSelectedBookingID] = useState(null);

  console.log("Authenticated User:", authenticatedUser);

  // Helper function to remove duplicate bookings by class ID and datetime
  const removeDuplicateBookings = (bookings) => {
    const uniqueBookings = new Map(); // Use a Map to ensure uniqueness

    bookings.forEach((booking) => {
      const key = `${booking.class_id}_${booking.class_datetime}`; // Unique key based on class and datetime
      if (!uniqueBookings.has(key)) {
        uniqueBookings.set(key, booking); // Add only if it's not already present
      }
    });

    return Array.from(uniqueBookings.values()); // Convert Map back to an array
  };

  // Filter function to display only current and future bookings
  const filterCurrentAndFutureBookings = (bookingsList) => {
    const now = new Date(); // Current date and time
    return bookingsList.filter((booking) => new Date(booking.class_datetime) >= now);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!authenticatedUser || !authenticatedUser.id) {
        console.error("Invalid or missing user ID");
        return;
      }

      try {
        setLoading(true);
        const response = await getBookingByUserID(
          localStorage.getItem("authentication_key"),
          authenticatedUser.id
        );

        console.log("Booking Response:", response);

        if (response && response.status === 200 && response.data) {
          const filteredBookings = filterCurrentAndFutureBookings(response.data);
          const uniqueBookings = removeDuplicateBookings(filteredBookings); // Apply the duplicate filter
          setBookings(uniqueBookings); // Set the unique, filtered bookings
        } else {
          console.error("Failed to fetch bookings:", response.message);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authenticatedUser]);

  const handleCancelBooking = async () => {
    try {
        const response = await deleteBooking(localStorage.getItem("authentication_key"), selectedBookingID);
        if (response.status === 200) {
            // Re-fetch bookings after successful deletion
            const updatedBookingsResponse = await getBookingByUserID(
                localStorage.getItem("authentication_key"),
                authenticatedUser.id
            );

            if (updatedBookingsResponse && updatedBookingsResponse.status === 200 && updatedBookingsResponse.data) {
                const filteredBookings = filterCurrentAndFutureBookings(updatedBookingsResponse.data);
                const uniqueBookings = removeDuplicateBookings(filteredBookings);
                setBookings(uniqueBookings); // Update bookings with fresh data
            } else {
                console.error("Failed to fetch updated bookings:", updatedBookingsResponse.message);
            }

            setShowModal(false); // Close the modal after successful deletion
        } else {
            console.error("Failed to cancel booking:", response.message);
        }
    } catch (error) {
        console.error("Error canceling booking:", error);
    }
};


  const openModal = (bookingID) => {
    setSelectedBookingID(bookingID);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBookingID(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };

  const formatTime = (datetimeString) => {
    if (!datetimeString) return "N/A";
    try {
      const date = new Date(datetimeString);
      return date.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      console.error("Error parsing time:", error);
      return "Invalid Time";
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 flex justify-center min-h-screen bg-cover bg-center bg-[#ffff]" >
        <div className="w-full max-w-3xl bg-opacity-80 p-6 rounded-lg bg-[#74b5e3]">
          <div className="m-4">
            <h1 className="text-2xl font-bold text-center bg-gray-200 text-black">Your Bookings</h1>
          </div>
          {loading ? (
            <p>Loading your bookings...</p>
          ) : bookings.length > 0 ? (
            <div className="space-y-4 mb-24">
              {bookings.map((booking) => (
                <div key={booking.booking_id} className="bg-white p-4 rounded shadow-md">
                  <div className="text-black">
                    <p><strong>Class Name:</strong> {booking.activity_name}</p>
                    <p><strong>Date:</strong> {formatDate(booking.class_datetime)}</p>
                    <p><strong>Duration:</strong> {booking.activity_duration || "N/A"} minutes</p>
                    <p><strong>Location:</strong> {booking.location_name}</p>
                    <p><strong>Trainer:</strong> {booking.trainer_firstname} {booking.trainer_lastname}</p>
                    <p><strong>Class Time:</strong> {formatTime(booking.class_datetime)}</p>

                    <div className="mt-4 text-center">
                      <button
                        onClick={() => openModal(booking.booking_id)}
                        className="px-4 py-2 text-xs tracking-wide rounded text-white bg-black hover:bg-red-600 focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-black ">No bookings found.</p>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <h2 className="text-lg font-bold mb-4 text-black">Confirm Cancellation</h2>
              <p className="text-black">Are you sure you want to cancel this booking?</p>
              <div className="mt-6 flex justify-around">
                <button
                  onClick={handleCancelBooking}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-red-600"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-400"
                >
                  No, Keep Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <NavBottom />
    </>
  );
}
