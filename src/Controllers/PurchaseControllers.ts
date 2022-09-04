import { Request, Response } from "express";
import * as PurchaseService from "../Services/PurchaseService";

export async function Payment(req: Request, res: Response) {
    console.log("Log do controller", req.body)
    const apiKey = req.headers["x-api-key"]
    console.log(apiKey)
    const { number, password, businessId, amount } = req.body;


        const repo = await PurchaseService.purchaseInsert(number, password, businessId, amount, apiKey);
        res.send(repo).status(201)

}