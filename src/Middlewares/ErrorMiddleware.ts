import { Request, Response } from "express";


function errorHandlingMiddleware(error: Error, req, res, next) {
	if (error.type === "error_...") return res.sendStatus(...);
	if (error.type === "error_...") return res.sendStatus(...);
	if (error.type === "error_...") return res.sendStatus(...);

	return res.sendStatus(500);
}