const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

require("dotenv").config();

// DB Connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Database Connected");
    })
    .catch(() => {
        console.log("Unable to connect to Database!")
    })

//Use parsing middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Import Routes
const userRoutes = require("./routes/user");

// Use Routes
app.use("/auth", userRoutes);

// PORT
const port = process.env.PORT || 8081;

// Starting a server
app.listen(port, () => {
    console.log(`App is running at port ${port}`);
});
