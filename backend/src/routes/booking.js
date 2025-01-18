import express from "express";
import { bookingCreate , getAllByUserID , deleteBooking , getAllBookingDetail, showClassDetails, finalizeBooking, checkDuplicateBooking} from "../controllers/booking.js"
import auth from "../middleware/auth.js";

const BookingAPIRouter = express.Router();

BookingAPIRouter.get("/" ,getAllBookingDetail)


// // http://localhost:8080/booking/createbooking
// BookingAPIRouter.post("/createbooking", 
//     auth(["admin", "trainer", "members"]), 
//     bookingCreate);


// http://localhost:8080/booking/:userID
BookingAPIRouter.get("/:id" , getAllByUserID)


// http://localhost:8080/booking/book_class/:class_id
BookingAPIRouter.get("/book_class/:class_id", 
    auth(["admin", "trainer", "members"]), 
    showClassDetails);


// http://localhost:8080/booking/book_class_confirmation
BookingAPIRouter.post("/book_class_confirmation", 
    auth(["admin", "trainer", "members"]), 
    finalizeBooking);



// http://localhost:8080/booking/:id
BookingAPIRouter.delete("/:id" , 
    auth(["admin", "trainer", "members"]), 
    deleteBooking);


    BookingAPIRouter.post("/check-duplicate", auth(["admin", "trainer", "members"]), checkDuplicateBooking);
      


export default BookingAPIRouter