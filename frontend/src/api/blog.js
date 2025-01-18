import { API_URL } from "./api";

export async function getAllBlog() {
  const response = await fetch(API_URL + "/blog", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const APIResponseObject = await response.json();
  return APIResponseObject;
}

export async function getAllByUserID(authentication_key, userID) {
  const response = await fetch(
    API_URL + `/blog/bloguser/${userID}`, 
    {

      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-KEY": authentication_key,
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject;
}

export async function getBlogbyID(authentication_key, blogID) {
  const response = await fetch(API_URL + `/blog/editblog/${blogID}`, {
    method: "GET", 
    headers: { 
      "Content-type": "application/json",
      "X-AUTH-KEY": authentication_key 
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch blog with status:", response.status);
    throw new Error(`Failed to fetch blog. Status: ${response.status}`);
  }

  const BlogeditAPIResponseObject = await response.json();
  return BlogeditAPIResponseObject;
}

export async function createnewBlog(authentication_key, blog) {
  const response = await fetch(
    API_URL + "/blog/createblog", 
    {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-AUTH-KEY": authentication_key  // The key should be in the headers, not the body
      },
      body: JSON.stringify(blog),
  });

  const postCreateBlogResponse = await response.json();
  return postCreateBlogResponse;
}

  export async function updateBlog(authentication_key, formData) {
    const response = await fetch(API_URL + `/blog/${formData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-KEY": authentication_key,
      },
      body: JSON.stringify(formData), 
    });

  
    const patchBlogResponse = await response.json();
    return patchBlogResponse;
  }
  

export async function deleteBlog(authentication_key, blogID) {
  
  const response = await fetch(API_URL + `/blog/${blogID}`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "X-AUTH-KEY": authentication_key,
      },
  });

  const deleteblogresponse = await response.json();
  return deleteblogresponse;
}
