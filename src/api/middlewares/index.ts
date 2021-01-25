import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class CustomMiddleware implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		console.log("===============New Request Detected===============");
		console.log("URL :", req.originalUrl);
		console.log("BODY :", req.body);
		next();
	}
}
