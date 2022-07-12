import express from "express";
import "express-async-errors";
import CardRouter from "./Routers/CardRouter";

const app = express();

app.use(CardRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log((`Running on port ${PORT}`))
})