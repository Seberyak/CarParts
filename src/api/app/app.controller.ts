import { Controller, Req } from "@nestjs/common";
import { AppService } from "../../core/services/app";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import Joi from "../../@input/joi";
import { Request } from "express";
import {
	Get,
	Post,
} from "../../core/utils/decorators/custom-requests/request-mapping";

@Controller("/")
export class AppController {
	constructor(private _AppService: AppService) {}

	@Get("/api/app")
	async getHello(@Req() req: Request): Promise<string> {
		return this._AppService.getHello();
	}

	@Post("api/app")
	async post(
		@wValidatedArg(Joi.object({ foo: Joi.string().required() }))
		args: {
			foo: string;
		}
	) {
		console.log(args);
	}
}
