import { Router } from "express";
import { Recharge } from "../Controllers/RechargeController"
const RechargeRouter = Router();

RechargeRouter.post("/cardRecharge", Recharge);

export default RechargeRouter;