import express from "express";
import { getAllLocation, XMLimport } from "../controllers/location.js";
import auth from "../middleware/auth.js";


const locationAPIRouter = express.Router();




// http://localhost:8080/location
locationAPIRouter.get("/" , getAllLocation)

locationAPIRouter.post("/upload-xml", 
    auth(["admin"]), 
    XMLimport )

export default locationAPIRouter