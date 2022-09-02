import { NextFunction, Request, Response } from "express";
import { CardSchema } from "../Schema/CardSchema";


export function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("Log do Middleware")
  console.log(req.body)
      const validation = CardSchema.validate(req.body);
      if (validation.error) {
        return res.sendStatus(422);
      }
    next();
  }