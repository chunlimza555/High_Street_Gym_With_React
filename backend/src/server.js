import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import UsersAPiRouter from "./routes/Users.js";
import BlogAPIRouter from "./routes/blog.js";
import ClassAPIRouter from "./routes/class.js";
import BookingAPIRouter from "./routes/booking.js";
import ActivityAPIRouter from "./routes/activity.js";
import locationAPIRouter from "./routes/location.js";


const app = express()
const port = 8080

// Enable cross-origin resources sharing (CORS)
app.use(cors({
    origin: true,
}));

// Enable JSON request parsing middleware
app.use(express.json());

// Enable file upload middleware
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

// Import and use the user controller / routes
app.use("/users", UsersAPiRouter);
app.use("/blog", BlogAPIRouter);
app.use("/class" , ClassAPIRouter);
app.use("/booking" , BookingAPIRouter);
app.use("/activity" , ActivityAPIRouter);
app.use("/location" , locationAPIRouter);

// Catch all for 500 or 404 errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Express server started on http://localhost:${port}`);
});
