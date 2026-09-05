import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

if (!process.env.PORT) {
    throw new Error("PORT is not defined in environment variables");
}

if (!process.env.ORIGIN) {
    throw new Error("ORIGIN is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
    ORIGIN: process.env.ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET,
}

export default config;