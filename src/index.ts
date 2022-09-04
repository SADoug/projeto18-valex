import express from "express";
import "express-async-errors";
import CardRouter from "./Routers/CardRouter";
import RechargeRouter from "./Routers/RechargeRouter"
import PurchaseRouter from "./Routers/PurchaseRouter"
import errorHandlerMiddleware from "./Middlewares/ErrorMiddleware";

import  cors  from "cors"
import { json } from "express";


const app = express();
app.use(json())
app.use(cors())
app.use(CardRouter)
app.use(RechargeRouter)
app.use(PurchaseRouter)
app.use(errorHandlerMiddleware);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log((`Running on port ${PORT}`))
})