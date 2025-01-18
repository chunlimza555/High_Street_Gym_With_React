import express from "express";
import { getAllActivity, ActivityImportXML } from "../controllers/activity.js";
import auth from "../middleware/auth.js";


const ActivityAPIRouter = express.Router();




// http://localhost:8080/activity
ActivityAPIRouter.get("/" , getAllActivity)



// http://localhost:8080/activity/upload-xml
ActivityAPIRouter.post("/upload-xml", 
    auth(["admin", "trainer"]), 
    ActivityImportXML )


export default ActivityAPIRouter