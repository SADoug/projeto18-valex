import { Request, Response } from "express";
import * as RechargeService from "../Services/RechargeService";

export async function Recharge(req: Request, res: Response) {
    console.log("Log do controller", req.body)
    const { number, amount } = req.body;

        const repo = await RechargeService.RechargeInsert(number, amount); 
        res.send(repo).status(201)

}