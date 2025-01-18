import { API_URL } from "./api";

// Function to fetch classes by dateimport { API_URL } from "./api"; // Make sure this import is correct

// Function to fetch classes by date
export async function getClassesByDate(authentication_key, selected_date, location_id) {
  const apiUrl = `${API_URL}/class?selected_date=${selected_date}&location_id=${location_id}`;
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-KEY": authentication_key,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch classes. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
}


  

// Function to fetch all classes (by calendar)
export async function getClassCalendar(authentication_key, location_id, day_of_week) {
  try {
      const response = await fetch(`${API_URL}/class/calendar?location_id=${location_id}&day_of_week=${day_of_week}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "X-AUTH-KEY": authentication_key,
          },
      });

      if (!response.ok) {
          console.error("Failed to fetch class calendar. Status:", response.status);
          throw new Error(`Failed to fetch class calendar. Status: ${response.status}`);
      }

      const APIResponseObject = await response.json();
      return APIResponseObject;
  } catch (error) {
      console.error("Error fetching class calendar:", error);
      throw error;
  }
}

// Fetch the default class calendar
export async function getClassCalendarDefault(authentication_key) {
  const apiUrl = `${API_URL}/class/calendarDefault`; // Ensure endpoint is correct
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-KEY": authentication_key, // Pass key in headers
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch default class calendar. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching class calendar:", error);
    throw error;
  }
}


export async function getAllActivities() {
  try {
    const response = await fetch(`${API_URL}/activities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch activities. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
}

// Function to fetch all locations
export async function getAllLocations() {
  try {
    const response = await fetch(`${API_URL}/locations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch locations. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
}



// Get classes for a specific trainer
export function getTrainerClasses(req, res) {
  const authKey = req.get("X-AUTH-KEY");

  if (!authKey) {
    return res.status(400).json({ status: 400, message: "Authentication key required" });
  }

  // Verify authenticated user and ensure it's a trainer
  Users.getByAuthenticationKey(authKey)
    .then((trainer) => {
      if (!trainer || trainer.role !== 'trainer') {
        return res.status(403).json({ status: 403, message: "Only trainers can access their classes." });
      }

      // Fetch the trainer's classes
      ClassUserActivity.getByClassTrainer(trainer.id)
        .then((classes) => {
          if (classes.length === 0) {
            return res.status(404).json({ status: 404, message: "No classes found for this trainer." });
          }
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

// Delete a class by ID
export function deleteClass(req, res) {
  const classId = req.params.id;
  const authKey = req.get("X-AUTH-KEY");

  if (!authKey) {
    return res.status(400).json({ status: 400, message: "Authentication key required" });
  }

  // Verify the authenticated trainer and ensure they own the class
  Users.getByAuthenticationKey(authKey)
    .then((trainer) => {
      if (!trainer || trainer.role !== 'trainer') {
        return res.status(403).json({ status: 403, message: "Only trainers can delete their classes." });
      }

      // Check if the trainer owns the class
      Class.getById(classId)
        .then((classData) => {
          if (!classData || classData.trainer_user_id !== trainer.id) {
            return res.status(404).json({ status: 404, message: "Class not found or you don't own this class." });
          }

          // Delete the class
          Class.deleteById(classId)
            .then(() => {
              res.status(200).json({ status: 200, message: "Class successfully deleted." });
            })
            .catch((error) => {
              console.error("Error deleting class:", error);
              res.status(500).json({ status: 500, message: "Failed to delete class." });
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



