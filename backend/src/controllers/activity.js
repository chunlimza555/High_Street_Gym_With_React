import * as activity from "../models/activities.js";
import { Router } from "express";
import xml2js from "xml2js";



const ActivityController = Router();


export function getAllActivity(req, res) {
    activity.getAll()
      .then((data) => res.status(200).json(data))
      .catch((error) => {
        console.error("Error fetching activities:", error);
        res.status(500).json({ message: "Failed to fetch activities" });
      });
  }
  

  export function ActivityImportXML(req, res) {
    console.log("Incoming request files:", req.files);

    if (req.files && req.files["xml-file"]) {
        const XMLFile = req.files["xml-file"];
        console.log("XML File received:", XMLFile);

        const fileText = XMLFile.data.toString();
        console.log("XML File Content:", fileText);

        const parser = new xml2js.Parser();

        // Parse the XML content
        parser.parseStringPromise(fileText)
            .then(data => {
                console.log("Parsed XML Data:", data);

                const activityUpload = data["activity-upload"];

                // Check if the XML structure is correct
                if (!activityUpload) {
                    console.error("Invalid XML structure.");
                    return res.status(400).json({ message: "Invalid XML structure." });
                }

                const activities = activityUpload.activities[0].activity || [];
                console.log("Extracted Activities:", activities);

                const operation = activityUpload.$.operation || "insert";
                console.log("Operation Type:", operation);

                if (operation === "insert") {
                    // Handle insert operation
                    Promise.all(
                        activities.map(activityData => {
                            const newActivity = {
                                name: activityData.activity_name[0] || '',
                                description: activityData.activity_description[0] || '',
                                duration: activityData.activity_duration[0] || ''
                            };
                            console.log("New Activity Data:", newActivity);

                            return activity.create(newActivity);
                        })
                    )
                    .then(() => {
                        console.log("Activities inserted successfully.");
                        res.status(200).json({ message: "Activities inserted successfully." });
                    })
                    .catch(error => {
                        console.error("Error inserting activities:", error);
                        res.status(500).json({ message: "Error inserting activities.", error });
                    });
                } else if (operation === "update") {
                    // Handle update operation
                    Promise.all(
                        activities.map(activityData => {
                            const updatedActivity = {
                                id: activityData.activity_id[0] || '',
                                name: activityData.activity_name[0] || '',
                                description: activityData.activity_description[0] || '',
                                duration: activityData.activity_duration[0] || ''
                            };
                            console.log("Updated Activity Data:", updatedActivity);

                            return activity.update(updatedActivity);
                        })
                    )
                    .then(() => {
                        console.log("Activities updated successfully.");
                        res.status(200).json({ message: "Activities updated successfully." });
                    })
                    .catch(error => {
                        console.error("Error updating activities:", error);
                        res.status(500).json({ message: "Error updating activities.", error });
                    });
                } else {
                    console.error("Unsupported operation:", operation);
                    res.status(400).json({ message: "Unsupported operation." });
                }
            })
            .catch(error => {
                console.error("XML Parsing Error:", error);
                res.status(500).json({ message: "XML Parsing Error.", error });
            });
    } else {
        console.error("No XML file provided.");
        res.status(400).json({ message: "No XML file provided." });
    }
}



  
export default ActivityController