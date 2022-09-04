import { Router } from "express";

import { Payment } from "../Controllers/PurchaseControllers";
const PurchaseRouter = Router();

PurchaseRouter.post("/cardPurchase", Payment);

export default PurchaseRouter;