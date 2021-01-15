import { Controller, Get } from "@nestjs/common";
import { AppService } from "../../core/services/app";

@Controller("api/app/")
export class AppController {
	constructor(private _AppService: AppService) {}

	@Get("/")
	async getProfile(): Promise<string> {
		return this._AppService.getHello();
	}
}
