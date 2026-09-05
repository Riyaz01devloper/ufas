import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
export default app;
