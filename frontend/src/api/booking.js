import { API_URL } from "./api";



export async function getClassDetails(class_id, authentication_key) {
  try {
    console.log("Fetching class details with auth key:", authentication_key);  // Log key for debugging
    console.log("Class ID from params:", class_id);
    const response = await fetch(`${API_URL}/booking/book_class/${class_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-KEY': authentication_key,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch class details. Status: ${response.status}`);
    }

    const APIResponseObject = await response.json();
    console.log('API Response:', APIResponseObject);
    return APIResponseObject;
  } catch (error) {
    console.error('Error fetching class details:', error);
    throw error;
  }
}

  

// Finalize the booking for the user
export async function finalizeBooking(class_id, trainer_id, authentication_key) {
    try {
      console.log("Attempting to finalize booking with:", { class_id, trainer_id });
  
      const response = await fetch(`${API_URL}/booking/book_class_confirmation`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-KEY': authentication_key,  // Ensure this key is passed correctly
        },
        body: JSON.stringify({ class_id, trainer_id }),
      });
  
      if (!response.ok) {
        const errorBody = await response.json(); 
        console.error("Failed to finalize booking, server responded with:", errorBody);
        throw new Error(`Failed to finalize booking. Status: ${response.status} - ${errorBody.message || "Unknown error"}`);
      }
  
      const APIResponseObject = await response.json();
      console.log("Booking successful:", APIResponseObject); // Log success response
      return APIResponseObject;
  
    } catch (error) {
      console.error('Error finalizing booking:', error.message || error);
      throw error;
    }
  }
  
  


// Fetch using POST method for Create Booking 
export async function bookingCreate(authentication_key, booking) {
    const response = await fetch (API_URL + `/booking` , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-KEY": authentication_key
        },
        body: JSON.stringify(booking),
    })
    const BookingAPIResponse = await response.json();
    return BookingAPIResponse
}


// Fetch GET Method for UserBooking  
export async function getBookingByUserID(authentication_key, userID) {
    const response = await fetch (API_URL + `/booking/${userID}` , {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-KEY": authentication_key
        },
    });

    const BookingAPIResponse = await response.json();
    return BookingAPIResponse;
}

  export async function deleteBooking(authentication_key, bookingID) {
    const response = await fetch (API_URL + `/booking/${bookingID}` , {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-KEY": authentication_key
        },
    });
    const DeleteBookingRESPONSE = await response.json();
    return DeleteBookingRESPONSE

  }

  export async function getAllBookingDetail(authentication_key) {
    const response = await fetch(API_URL + `/booking`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-KEY": authentication_key,
        },
    });

    const BookingAPIResponse = await response.json();
    console.log("Fetched Bookings:", BookingAPIResponse); // Log fetched bookings for debugging
    return BookingAPIResponse;
}




export async function checkDuplicateBooking(user_id, class_id, auth_key) {
  const response = await fetch(`${API_URL}/booking/check-duplicate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": auth_key,
    },
    body: JSON.stringify({ user_id, class_id }),
  });

  const data = await response.json();
  return data.isBooked; // Return true if already booked, otherwise false
}