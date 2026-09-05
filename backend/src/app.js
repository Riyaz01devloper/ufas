import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import masterdataRouter from "./routes/masterdata.routes.js";
import cors from "cors";
const corsOptions = {
  origin: config.ORIGIN,
  credentials: true,
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/masterdata", masterdataRouter);

export default app;