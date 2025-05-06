import express from "express";
import morgan from "morgan";
import cors from "cors";
import initApp from "./src/app.router.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT ;

app.use(cors());
app.use(morgan("dev"));
initApp(app, express);
 


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})