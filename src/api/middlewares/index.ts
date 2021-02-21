import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
require("dotenv").config();

@Injectable()
export class RequestsLoggerMiddleware implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		if (process.env.MODE !== "development") next();
		const n = 40;
		console.log(`${"=".repeat(n)} New Request Detected ${"=".repeat(n)}`);
		console.log("URL :", req.originalUrl);
		console.log(`${"=".repeat(n)}`);
		console.log("BODY :", req.body);
		console.log(`${"=".repeat(n)}`);
		console.log("PARAMS :", req.params);
		console.log(`${"=".repeat(n)}`);
		console.log("QUERY :", req.query);

		next();
	}
}
