import e from "express";
import { getClassesByDate, getClassCalendarDefault, getTrainerClasses, deleteClass} from "../controllers/class.js";
import auth from "../middleware/auth.js";

const ClassAPIRouter = e.Router();


// http://localhost:8080/class
// ClassAPIRouter.get("/" , getAllClass);

// http://localhost:8080/class/:date
// ClassAPIRouter.get("/:date" , getClassesByDate)



ClassAPIRouter.get("/", getClassesByDate);  // Get classes by date

// ClassAPIRouter.get("/calendar", 
//     // auth(["admin", "trainer", "member"]), 
//     getClassCalendar);


ClassAPIRouter.get("/calendarDefault", 
    auth(["admin", "trainer", "members"]), // Ensure correct roles are allowed
    getClassCalendarDefault
  );



// http://localhost:8080/class/trainer
ClassAPIRouter.get("/trainer", 
  auth(["trainer"]), 
  getTrainerClasses);  // Route for trainers to get their classes



// http://localhost:8080/class/:id
ClassAPIRouter.delete("/:id", 
  auth(["trainer"]), 
  deleteClass);  // Route for trainers to delete a class
  


export default ClassAPIRouter

