import { Request, Response } from "express";
import { string } from "joi";
import * as CardService from "../Services/CardService";

export async function CardController(req: Request, res: Response) {
    const { number, cardholderName, securityCode, expirationDate, password, isVirtual, originalCardId, isBlocked, type } = req.body;

    try {
       if (!number || !cardholderName || !securityCode || !expirationDate || !password || !isVirtual || !originalCardId || !isBlocked || !type) {
           throw new Error('Missing required fields');
       }
        const repo = CardService.CardInsert({number, cardholderName, 
            securityCode, expirationDate,
            password, isVirtual, 
            originalCardId, isBlocked, 
            type}); 

        res.send("Working")

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}