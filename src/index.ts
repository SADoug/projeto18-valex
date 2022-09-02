import express from "express";
import CardRouter from "./Routers/CardRouter";
import  cors  from "cors"
import { json } from "express";


const app = express();
app.use(json())
app.use(cors())
app.use(CardRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log((`Running on port ${PORT}`))
})