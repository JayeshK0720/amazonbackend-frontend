require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");
require("./db/connection");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require("path");

const Products = require("./models/productsSchema");

const DefaultData = require("./defaultdata");
const cors = require("cors");
const router = require("./routes/router");

app.use(cookieParser(""));
app.use(cors({
    origin: ['https://localhost:3000',
    '',], // Replace with your React app's origin
    credentials: true, // Allow credentials to be sent along with the request
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials']
}));
app.set("trust proxy",1);

app.use(session({
    secret: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 604800000,sameSite: 'none',secure : true}, //one week
    // store: store
}));

app.use(express.json());

app.use(router);

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const port = process.env.PORT || 8005;

app.listen(port, () => {
    console.log(`Server is running on port number ${port}`);
});

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', '*');
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     next();
// });

// app.use((req, res, next) => {
//     const accessToken = req.cookies.access_token ? '\x1b[32mTrue\x1b[0m' : '\x1b[31mFalse\x1b[0m';
//     console.log(`\x1b[1m\x1b[37m[${new Date().toLocaleTimeString([], {hour12: false, hourCycle: 'h23'})}] \x1b[1m\x1b[33m[Server] [Debug]\x1b[0m - Path: ${req.path} - Method: ${req.method} - Body: ${JSON.stringify(req.body)} - Access Token: ${accessToken}`);
//     next(); // this has to be called
// });

DefaultData();