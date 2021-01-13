import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	NotFoundException,
} from "@nestjs/common";
import { Request } from "express";
import { MError } from "../core/utils/errors";

@Catch()
export class ErrorFilter implements ExceptionFilter {
	catch(e: Error, host: ArgumentsHost) {
		const req = host.switchToHttp().getRequest<Request>();
		const res = host.switchToHttp().getResponse();
		let outputError = false;
		if (
			!(e instanceof MError) ||
			(process.env.NODE_ENV || "development") === "development"
		) {
			outputError = true;
		}
		if (
			!outputError &&
			e instanceof MError &&
			e.errorCode !== 404 &&
			e.errorCode !== 401 &&
			e.errorCode !== 417 &&
			e.errorCode !== 403
		) {
			outputError = true;
		}
		if (outputError) {
			console.error("=======START=======");
			console.error("Date: " + new Date().toUTCString());
			console.error("URL: " + req.url);
			if (req.body) console.error("Body: " + JSON.stringify(req.body));
			console.trace(e);
			console.error("=======END=======\n");
		}
		if (res.headersSent) return;
		if (e instanceof MError) {
			res.status(e.errorCode).json(e.errorMessage);
			return;
		}
		if (e instanceof NotFoundException) {
			res.status(404).send("404 - Route Not Matched!");
			return;
		}
		res.status(500).send(e.message);
	}
}
