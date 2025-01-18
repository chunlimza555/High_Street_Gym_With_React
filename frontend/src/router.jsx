import { createBrowserRouter } from "react-router-dom";
import { RestrictedRoute } from "./common/RestrictedRoute";
import LoginPage from "./features/users/LoginPage";
import RegisterPage from "./features/users/RegisterPage";
import HomePage from "./features/pages/HomePage";
import AllBlog from "./features/blog/AllBlog";
import UserBooking from "./features/booking/UserBooking";
import Booking from "./features/booking/Booking";
import ClassPage from "./features/class/Class";
import ClassTrainer from "./features/class/ClassTrainer";
import Profile from "./features/users/Profile";
import ProfileEdit from "./features/users/ProfileEdit";
import Createblog from "./features/blog/Createblog";
import Userblog from "./features/blog/Userblog";
import EditblogUser from "./features/blog/EditblogUser"; 
import XMLPages from "./features/pages/XML";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/blog",
        element: <AllBlog />
    },
    {
        path: "/profile",
        element: 
        <RestrictedRoute allowedRoles={["admin", "trainer", "members"]}> 
          <Profile />
        </RestrictedRoute>
    },

    {
        path: "/profileedit/:userID",
        element:
        <RestrictedRoute allowedRoles={["admin", "trainer", "members"]}>
          <ProfileEdit />
        </RestrictedRoute>,
    },
    {
        path: "/createblog",
        element: 
        <RestrictedRoute allowedRoles={["admin", "trainer", "members"]}> 
          <Createblog />
        </RestrictedRoute>
    },
    {
        path: "/bloguser/:userID",
        element: 
        <RestrictedRoute allowedRoles={["admin", "trainer", "members"]}> 
          <Userblog />
        </RestrictedRoute>
    },
    {
        path: "/blogedit/:blogID",
        element: 
        <RestrictedRoute allowedRoles={["admin", "trainer", "members"]}> 
          <EditblogUser />
        </RestrictedRoute>
    },
    {
        path: "/class",
        element: <ClassPage />
    },
    {
      path: "/classtrainer",
      element: <ClassTrainer />
      
  },


    {
      path: "/book_class/:class_id/:date", // Ensure both params are captured
      element: <Booking />
    }
    
    
    ,
    {
        path: "/userbooking",
        element: 
        <RestrictedRoute allowedRoles={["admin", "trainer", "members"]}> 
          <UserBooking />
        </RestrictedRoute>
    },

    {
      path: "/xml-import",
      element: (
      <RestrictedRoute allowedRoles={["admin"]}>
      <XMLPages />
      </RestrictedRoute>
      ),
    },
]);

export default router;
