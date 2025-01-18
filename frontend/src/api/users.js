import { API_URL } from "./api";


export async function loginUser(email, password) {
  const response = await fetch(API_URL + "/users/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Correct format
  });

  if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
  }

  return response.json(); // This should return the authentication key
}

// export async function loginUser(email, password) {
//   const response = await fetch(API_URL + "/users/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email: email, 
//       password: password, 
//     }),
//   });

//   const APIResponseObject = await response.json();
//   return APIResponseObject;
// }

export async function logout(authentication_key) {
  const response = await fetch(API_URL + "/users/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authentication_key,
    },
    body: JSON.stringify({}),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function getByAuthenticationKey(authentication_key) {
  const response = await fetch(API_URL + "/users/getByAuthenticationKey", {
    method: "GET",
    headers: {
      "X-AUTH-KEY": authentication_key,
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject.user; // Make sure this returns the correct user object
}


export async function registerUser(user) {
  const response = await fetch(API_URL + "/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const pathUserResult = await response.json();
  return pathUserResult;
}

export async function updateUserProfile(authentication_key, user) {
  const response = await fetch(API_URL + `/users/profile/${user.user_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authentication_key, 
    },
    body: JSON.stringify({
      id: user.id,
      email: user.email, 
      password: user.password, 
      phone: user.phone,
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
    }), 
  });

  const APIResponseObject = await response.json();
  return APIResponseObject;
}

