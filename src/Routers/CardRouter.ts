import { Router } from "express";
import { validateSchemaMiddleware } from "../Middlewares/CardMiddleware";
import { CardController } from "../Controllers/CardController";
console.log("Router")
const CardRouter = Router();

CardRouter.post("/card", validateSchemaMiddleware, CardController);


export default CardRouter;