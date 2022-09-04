import joi from "joi";

export const CardActivationSchema = joi.object({
    securityCode: joi.string().required(),
    number: joi.string().required(),
    password: joi.string().max(4)
});
