import { Router } from "express";
import * as Class from "../models/classes.js";
import * as ClassUserActivity from "../models/class-user-activity.js";
import * as Users from "../models/users.js";
import validator from "validator";

const classController  = Router();

// export function getAllClass(req , res) {
//     BookingClassUser.getAll()
//     .then(classes => {
//         return res.status(200).json(classes);
//     })
//     .catch(error => {
//         console.error('Error fetching classes:', error);
//         return res.status(500).json({ status: 500, message: 'Failed to fetch classes' });
//     })
// }

// export function getClassesByDate(req, res) {
//     const date = req.params.date;
//     ClassUserActivity.getClassByDate(date)
//       .then((classes) => {
//         if (classes.length === 0) {
//             // If there are no classes in the date 
//           return res.status(200).json([]);
//         }
//         // return if there are classes within the selected date 
//         return res.status(200).json(classes);
//       })
//       .catch((error) => {
//         return res.status(500).json({ status: 500, message: "Failed to fetch classes for the provided date" });
//       });
//   }


// Function to convert UTC to Brisbane time (UTC+10)
// function convertToBrisbaneTime(dateString) {
//   const date = new Date(dateString); // Create a Date object from the UTC date string
//   const localTime = new Date(date.getTime() + (10 * 60 * 60 * 1000)); // Adding 10 hours to UTC for Brisbane Time
//   console.log("Converted to Brisbane Time:", localTime);  // Log converted Brisbane time
//   return localTime;
// }

// Function to format the date in "1st January", "2nd February" format
// function formatDate(date) {
//   const day = date.getDate();
//   const month = date.toLocaleString('default', { month: 'long' });
//   const suffix = (day % 10 === 1 && day !== 11) ? 'st'
//     : (day % 10 === 2 && day !== 12) ? 'nd'
//     : (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
//   return `${day}${suffix} ${month}`;
// }

// Function to format time to "HH:MM"
// function formatTime(date) {
//   return date.toLocaleTimeString("en-AU", { hour: '2-digit', minute: '2-digit', hour12: false });
// }

export function getClassesByDate(req, res) {
  const { selected_date, location_id } = req.query;

  if (!selected_date || !location_id) {
    return res.status(400).json({ status: 400, message: "Both date and location are required" });
  }

  // Log input values to check correctness
  console.log("Received selected_date:", selected_date);
  console.log("Received location_id:", location_id);

  // Call the database model to get classes by date
  ClassUserActivity.getByLocationAndDate(location_id, selected_date)
    .then((classes) => {
      if (!classes || classes.length === 0) {
        return res.status(200).json({ status: 404, message: "No classes found for this location and date" });
      }

      // Log the classes fetched from the database
      console.log("Classes fetched from the database:", classes);

      // The class data formatting is now handled by the model
      res.status(200).json({
        status: 200,
        message: "Classes fetched successfully",
        data: { classes },  // The classes will already be formatted in the model
      });
    })
    .catch((error) => {
      console.error("Error fetching classes by date:", error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    });
}





// export function getClassCalendar(req, res) {
//   const { location_id, day_of_week } = req.query;

//   // Validate the input
//   if (!location_id || !day_of_week) {
//     return res.status(400).json({
//       status: 400,
//       message: "Both location_id and day_of_week are required",
//     });
//   }

//   ClassUserActivity.getByLocationAndDayOfWeek(location_id, day_of_week)
//     .then((classes) => {
//       if (!classes || classes.length === 0) {
//         return res.status(404).json({
//           status: 404,
//           message: "No classes found for this location and day",
//         });
//       }

//       res.status(200).json({
//         status: 200,
//         message: "Classes fetched successfully",
//         data: { classes },
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching classes by location and day:", error);
//       res.status(500).json({
//         status: 500,
//         message: "Internal Server Error",
//       });
//     });
// }


  export function getClassCalendarDefault(req, res) {
    
      ClassUserActivity.getAllLocation()
          .then(locations => {
              return res.status(200).json({
                  status: 200,
                  message: "Locations fetched successfully",
                  data: {
                      locations,
                      classes: []
                  }
              });
          })
          .catch(error => {
              console.error("Error fetching locations:", error);
              return res.status(500).json({
                  status: 500,
                  message: "Internal Server Error while fetching locations"
              });
          });
  }
  




// Fetch trainer's classes
export function getTrainerClasses(req, res) {
  const authKey = req.get("X-AUTH-KEY");

  if (!authKey) {
    return res.status(400).json({ status: 400, message: "Authentication key required" });
  }

  Users.getByAuthenticationKey(authKey)
    .then((trainer) => {
      console.log("Authenticated Trainer:", trainer);

      if (!trainer || trainer.role !== 'trainer') {
        return res.status(403).json({ status: 403, message: "Only trainers can access their classes." });
      }

      ClassUserActivity.getByClassTrainer(trainer.id)
        .then((classes) => {
          console.log("Fetched Trainer Classes (raw):", classes);

          // No time conversion, return classes as is
          res.status(200).json({ status: 200, data: classes });
        })
        .catch((error) => {
          console.error("Error fetching trainer classes:", error);
          res.status(500).json({ status: 500, message: "Internal server error." });
        });
    })
    .catch((error) => {
      console.error("Error fetching trainer by auth key:", error);
      res.status(500).json({ status: 500, message: "Internal server error." });
    });
}



// Delete a class by ID with Brisbane time logging
export function deleteClass(req, res) {
  const classId = req.params.id;
  const authKey = req.get("X-AUTH-KEY");

  console.log(`Deleting class ID: ${classId} with auth key: ${authKey}`); // Log class ID and auth key

  Users.getByAuthenticationKey(authKey)
    .then((trainer) => {
      console.log("Authenticated Trainer:", trainer); // Log authenticated trainer

      if (!trainer || trainer.role !== "trainer") {
        return res.status(403).json({ status: 403, message: "Access denied. Only trainers can delete their classes." });
      }

      Class.getById(classId)
        .then((classData) => {
          console.log("Fetched Class Data:", classData); // Log class data

          if (Number(classData.trainer_user_id) !== Number(trainer.id)) {
            console.log(`Trainer ID: ${trainer.id}, Class Trainer ID: ${classData.trainer_user_id} - Mismatch!`);
            return res.status(404).json({ status: 404, message: "Class not found or you don't own this class." });
          }

          

          Class.deleteById(classId)
            .then(() => {
              console.log(`Class with ID ${classId} successfully deleted.`);
              res.status(200).json({ status: 200, message: "Class successfully deleted." });
            })
            .catch((error) => {
              console.error("Error deleting class:", error);
              res.status(500).json({ status: 500, message: "Internal server error." });
            });
        })
        .catch((error) => {
          console.error("Error fetching class by ID:", error);
          res.status(500).json({ status: 500, message: "Internal server error." });
        });
    })
    .catch((error) => {
      console.error("Error fetching trainer by auth key:", error);
      res.status(500).json({ status: 500, message: "Internal server error." });
    });
}




export default classController;
