import { Request, Response } from "express";
import * as CardService from "../Services/CardService";

export async function CreateCard(req: Request, res: Response) {
    const apiKey = req.headers["x-api-key"]
    const { cardholderName, password, isVirtual, originalCardId, isBlocked, type, employeeId } = req.body;

     const repo = await CardService.CardInsert(cardholderName,
        password, isVirtual,
        originalCardId, isBlocked,
        type, employeeId, apiKey);
        res.send(repo).status(201)

}

export async function cardActivation(req: Request, res: Response) {
    const { number, securityCode, password } = req.body;

    const repo = await CardService.cardActivation(number,
        securityCode,
        password)

    res.send(repo).status(201)

}

export async function cardPayment(req: Request, res: Response) {
    const { number } = req.body;

        const repo = await CardService.cardPayment(
            number);

        res.send(repo).status(201)

}

export async function BlockCard(req: Request, res: Response) {

    const { number, password } = req.body;
        const repo = await CardService.BlockCard(number, password);

        res.send(repo).status(201)

}
export async function UnBlockCard(req: Request, res: Response) {

    const { number, password } = req.body;

        const repo = await CardService.UnBlockCard(number, password);
        res.send(repo).status(201)

}
