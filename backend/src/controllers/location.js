import * as location from "../models/location.js";
import { Router } from "express";
import xml2js from "xml2js";

const locationController = Router();


// Function to get all locations
export function getAllLocation(req, res) { 
    location.getAll()
        .then(locations => {
            return res.status(200).json(locations);
        })
        .catch(error => {
            console.error("Error fetching locations:", error);
            return res.status(500).json({
                status: 500,
                message: "Error fetching locations."
            });
        });
}


// XML import for locations (insert/update based on XML operation)
export function XMLimport(req, res) {
    console.log("Incoming request files:", req.files); 

    if (req.files && req.files["xml-file"]) {
        const XMLFile = req.files["xml-file"];
        console.log("XML File received:", XMLFile); 

        const fileText = XMLFile.data.toString();
        console.log("XML File Content:", fileText); 

        const parser = new xml2js.Parser();

        parser.parseStringPromise(fileText)
            .then(data => {
                console.log("Parsed XML Data:", data);

                const locationUpload = data["location-upload"];

                if (!locationUpload) {
                    console.error("Invalid XML structure.");
                    return res.status(400).json({ message: "Invalid XML structure." });
                }

                const operation = locationUpload.$.operation || "insert";
                console.log("Operation Type:", operation);

                const locations = locationUpload["locations"]?.[0]?.["location"] || [];
                console.log("Extracted Locations:", locations);

                if (locations.length === 0) {
                    console.error("No locations found in the XML.");
                    return res.status(400).json({
                        status: 400,
                        message: "No locations found in the XML."
                    });
                }

                const validationErrors = [];
                locations.forEach((locationData, index) => {
                    const locationName = locationData.location_name?.[0] || '';
                    console.log(`Location Name at Index ${index}:`, locationName);

                    if (!/^[A-Za-z\s]+$/.test(locationName)) {
                        const errorMsg = `Location name at index ${index} is invalid.`;
                        console.error(errorMsg);
                        validationErrors.push(errorMsg);
                    }
                });

                if (validationErrors.length > 0) {
                    console.error("Validation errors found:", validationErrors);
                    return res.status(400).json({
                        status: 400,
                        message: "Validation failed.",
                        errors: validationErrors
                    });
                }

                if (operation === "insert") {
                    console.log("Starting Insert Operation...");
                    Promise.all(locations.map(locationData => {
                        const newLocation = {
                            location_name: locationData.location_name?.[0] || ''
                        };
                        console.log("New Location Data:", newLocation);
                        return location.create(newLocation);
                    }))
                    .then(() => {
                        console.log("Locations inserted successfully.");
                        res.status(200).json({
                            status: 200,
                            message: "Locations inserted successfully."
                        });
                    })
                    .catch(error => {
                        console.error("Database Insertion Error:", error);
                        res.status(500).json({
                            status: 500,
                            message: "Error inserting locations: " + error.message
                        });
                    });
                } else if (operation === "update") {
                    console.log("Starting Update Operation...");
                    Promise.all(locations.map(locationData => {
                        const locationID = locationData.location_id?.[0];
                        if (!locationID) {
                            const errorMsg = "Location ID is required for update.";
                            console.error(errorMsg);
                            throw new Error(errorMsg);
                        }

                        const updatedLocation = {
                            id: locationID,
                            location_name: locationData.location_name?.[0] || ''
                        };
                        console.log(`Updated Location Data for ID ${locationID}:`, updatedLocation);

                        return location.update(updatedLocation);
                    }))
                    .then(() => {
                        console.log("Locations updated successfully.");
                        res.status(200).json({
                            status: 200,
                            message: "Locations updated successfully."
                        });
                    })
                    .catch(error => {
                        console.error("Database Update Error:", error);
                        res.status(500).json({
                            status: 500,
                            message: "Error updating locations: " + error.message
                        });
                    });
                } else {
                    const errorMsg = "Unsupported operation in the XML.";
                    console.error(errorMsg);
                    res.status(400).json({
                        status: 400,
                        message: errorMsg
                    });
                }
            })
            .catch(error => {
                console.error("XML Parsing Error:", error);
                res.status(500).json({
                    status: 500,
                    message: "Error parsing XML: " + error.message
                });
            });
    } else {
        const errorMsg = "No XML file provided.";
        console.error(errorMsg);
        res.status(400).json({
            status: 400,
            message: errorMsg
        });
    }
}



export default locationController;
