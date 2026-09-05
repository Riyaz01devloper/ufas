import express from "express";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
// const { PrismaClient } = require("@prisma/client");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

export default app;