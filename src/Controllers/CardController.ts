import { Request, Response } from "express";
import * as CardService from "../Services/CardService";

export async function CardController(req: Request, res: Response) {
    console.log("Log do controller", req.body)
    const apiKey = req.headers["x-api-key"]
    const { number, cardholderName, securityCode, expirationDate, password, isVirtual, originalCardId, isBlocked, type, employeeId } = req.body;

    try {
    
        const repo = CardService.CardInsert(number, cardholderName, 
            securityCode, expirationDate,
            password, isVirtual, 
            originalCardId, isBlocked, 
            type, employeeId, apiKey); 

        res.send(repo).status(201)

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}