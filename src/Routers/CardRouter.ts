import { Router } from "express";
import { validateSchemaMiddleware, validateSchemaMiddlewareActivation} from "../Middlewares/CardMiddleware";
import { CreateCard, cardActivation, cardPayment, BlockCard, UnBlockCard} from "../Controllers/CardController";

const CardRouter = Router();

CardRouter.post("/cardCreate", validateSchemaMiddleware, CreateCard);
CardRouter.post("/cardActivation",validateSchemaMiddlewareActivation, cardActivation);
CardRouter.get("/cardPayment", cardPayment);
CardRouter.put("/cardBlock", BlockCard);
CardRouter.put("/cardUnblock", UnBlockCard);

export default CardRouter;