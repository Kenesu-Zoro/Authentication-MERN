import express from "express";
import DBconnection from "./database/connect.db.js";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    DBconnection();
    console.log("Database connected successfully !");
    console.log(`Server is running on port ${PORT}`);
});
