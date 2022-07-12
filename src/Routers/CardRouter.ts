import { Router } from "express";
import { validateSchemaMiddleware } from "../Middlewares/CardMiddleware";
import { CardSchema } from "../Schema/CardSchema";
import { CardController } from "../Controllers/CardController";

const CardRouter = Router();

CardRouter.post(
  "/card", validateSchemaMiddleware(CardSchema), CardController
);


export default CardRouter;