// console.log("this is tendo maya")
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

require("dotenv").config()

const app = express ();

const HOST_SERVER = process.env.HOST_SERVER;
const PORT = process.env.PORT;

app.use(cors({
    credentials: true
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server running on http://${HOST_SERVER}:${PORT}`)
})

const MONGO_URL = process.env.DATABASE_URL;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error)); 

app.use('/', router());