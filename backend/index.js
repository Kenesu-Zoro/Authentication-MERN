import express from "express";
import DBconnection from "./database/connect.db.js";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);



app.listen(process.env.PORT, () => {
    DBconnection();
    console.log("Database connected successfully !");
    console.log(`Server is running on port ${process.env.PORT}`);
});
