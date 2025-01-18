import { Router } from "express";
import * as Booking from "../models/bookings.js";
import * as Classes from "../models/classes.js";
import * as Trainers from "../models/class-user-activity.js";
import * as BookingClassUser from "../models/booking-class-user.js";
import validator from "validator";

const bookingController = Router();



export function showClassDetails(req, res) {
  const { class_id } = req.params;

  // Validate class_id to ensure it is numeric
  if (!validator.isNumeric(class_id)) {
    return res.status(400).json({ message: "Invalid class ID" });
  }

  console.log('Fetching class details for ID:', class_id);

  BookingClassUser.getByClassId(class_id)
    .then((classDetails) => {
      if (!classDetails || classDetails.length === 0) {
        return res.status(404).json({ message: 'Class not found' });
      }

      // Fetch trainers if class details are found
      Trainers.getAllTrainers()
        .then((trainers) => {
          res.status(200).json({
            data: { classDetails: classDetails[0], trainers },
          });
        })
        .catch((error) => {
          console.error('Error fetching trainers:', error);
          res.status(500).json({
            message: 'Failed to fetch trainers. Please try again later.',
          });
        });
    })
    .catch((error) => {
      console.error('Error fetching class details:', error);
      res.status(500).json({ message: 'Failed to fetch class details' });
    });
}




export function finalizeBooking(req, res) {
  const { class_id, trainer_id } = req.body;

  console.log("class_id type:", typeof class_id);  // Debugging log
  console.log("trainer_id type:", typeof trainer_id);

  const user_id = String(req.user?.id);  // Ensure user_id is a string

  if (!user_id) {
    return res.status(400).json({
      status: 400,
      message: "User not found or not authenticated",
    });
  }

  if (
    !class_id || !trainer_id ||
    !validator.isNumeric(String(class_id)) ||
    !validator.isNumeric(String(trainer_id))
  ) {
    return res.status(400).json({
      status: 400,
      message: "Invalid class_id or trainer_id",
    });
  }

  const booking = Booking.newBooking(
    null,
    user_id,
    String(class_id),  // Ensure class_id is a string
    new Date().toISOString().slice(0, 19).replace("T", " "),
    "",
    "",
    "",
    "",
    ""
  );

  Booking.create(booking)
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Booking successful",
      });
    })
    .catch((error) => {
      console.error("Error creating booking:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error while booking the class",
      });
    });
}






// Create function Booking Controller
export function bookingCreate(req, res) {
  const BookingForm = req.body;
  console.log("Booking data received:", BookingForm); // Debugging log

  // Fetch all bookings to compare with the incoming booking request
  //Temporary solution until i find a way to get the specific user for now 
  
  Booking.getAll()
    .then((allBookings) => {
      // Check if a booking already exists for the same user and class
      const existingBooking = allBookings.find(
        (booking) => 
          booking.user_id === BookingForm.user_id && 
          booking.class_id === BookingForm.class_id
      );

      if (existingBooking) {
        console.log("User already booked the same class"); // Debug log if booking exists
        return res.status(409).json({
          status: 409,
          message: "Booking already exists",
        });
      }


    
      // If no existing booking, proceed to create a new one
      const newBooking = Booking.newBooking(
        null, // booking_id (auto-generated)
        BookingForm.user_id, // Ensure this is a valid integer
        BookingForm.class_id, 
        new Date().toISOString().slice(0, 19).replace("T", " "), 
        "pending"
    );

      Booking.create(newBooking)
        .then((result) =>
          res.status(201).json({
            status: 201,
            message: "Booking created successfully",
            data: result,
          })
        )
        .catch((error) =>
          res.status(500).json({
            status: 500,
            message: "Failed to create booking",
            error: error,
          })
        );
    })
    .catch((error) => {
      console.error("Error fetching bookings:", error); // Debug log
      res.status(500).json({
        status: 500,
        message: "Failed to check existing bookings",
        error: error,
      });
    });
}


// Get All booking by UserID Controller Function
export function getAllByUserID(req, res) {
  const userID = req.params.id;
  console.log("Fetching bookings for userID:", userID); // Debugging log

  if (userID) {
    BookingClassUser.getAllByUserID(userID)
      .then((booking) => {
        console.log("Bookings found:", booking); // Additional log
        if (booking.length > 0) {
          return res.status(200).json({
            status: 200,
            message: "Bookings retrieved successfully",
            data: booking // Ensure `booking` is an array
          });
        } else {
          return res.status(404).json({
            status: 404,
            message: "No booking found",
          });
        }
      })
      .catch((error) =>
        res.status(500).json({
          status: 500,
          message: "Failed to fetch booking",
          error: error,
        })
      );
  }
}

export function deleteBooking(req, res) {
  const bookingID = req.params.id;
  console.log("Deleting booking with ID:", bookingID); // Debugging log

  if (bookingID) {
      Booking.deleteById(bookingID)
          .then((result) =>
              res.status(200).json({
                  status: 200,
                  message: "Booking deleted successfully",
                  data: result,
              })
          )
          .catch((error) =>
              res.status(500).json({
                  status: 500,
                  message: "Failed to delete booking",
                  error: error,
              })
          );
  } else {
      return res.status(400).json({
          status: 400,
          message: "Booking ID is required",
      });
  }
}

export function getAllBookingDetail(req, res) {
  BookingClassUser.getAll()
      .then((bookings) => {
          return res.status(200).json({
              status: 200,
              message: "Bookings retrieved successfully",
              data: bookings,
          });
      })
      .catch((error) =>
          res.status(500).json({
              status: 500,
              message: "Failed to fetch bookings",
              error: error,
          })
      );
}



export const checkDuplicateBooking = async (req, res) => {
  const { user_id, class_id } = req.body;

  try {
      const [result] = await db_conn.query(
          `SELECT * FROM bookings WHERE booking_user_id = ? AND booking_class_id = ?`,
          [user_id, class_id]
      );

      res.json({ isBooked: result.length > 0 });
  } catch (error) {
      console.error("Error checking duplicate booking:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};






export default bookingController;
