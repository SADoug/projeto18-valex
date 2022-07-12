import joi from "joi";

export const CardSchema = joi.object({
    number: joi.number().required(),
    cardholderName: joi.string().required(),
    securityCode: joi.string().required(),
    expirationDate: joi.string().required(),
    password: joi.string().required(),
    isVirtual: joi.boolean().required(),
    originalCardId: joi.number().required(),
    isBlocked: joi.boolean().required(),
    type: joi.string().required(),
    
});
