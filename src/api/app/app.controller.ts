import { Controller, Req } from "@nestjs/common";
import { AppService } from "../../core/services/app";
import { Request } from "express";
import { Get } from "../../core/utils/decorators/custom-requests/request-mapping";

@Controller("/")
export class AppController {
	constructor(private readonly _AppService: AppService) {}

	@Get("/api/app")
	async getHello(@Req() req: Request): Promise<string> {
		return this._AppService.getHello();
	}
}
