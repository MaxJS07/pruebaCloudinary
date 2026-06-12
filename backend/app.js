import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import patients from "./src/routes/patients.route.js"
import logout from "./src/routes/logout.route.js"
import specialties from "./src/routes/specialties.route.js"

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials:true
}))

app.use("/api/patients", patients);
app.use("/api/logout", logout );
app.use("/api/specialties", specialties);

export default app;