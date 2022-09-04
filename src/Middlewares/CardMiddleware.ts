import { NextFunction, Request, Response } from "express";
import { CardSchema} from "../Schema/CardSchema";
import { CardActivationSchema } from "../Schema/ActivationSchema";


export function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("Log do Middleware")
  console.log(req.body)
      const validation = CardSchema.validate(req.body);
      if (validation.error) {
        return res.send(validation.error).status(422);
      }
    next();
  }
  export function validateSchemaMiddlewareActivation(req: Request, res: Response, next: NextFunction) {
    console.log("Log do Middleware")
    console.log(req.body)
        const validation = CardActivationSchema.validate(req.body);
        if (validation.error) {
          return res.send(validation.error).status(422);
        }
      next();
    }