import { Controller, UseGuards } from "@nestjs/common";
import { Get } from "../../core/utils/decorators/custom-requests/request-mapping";
import { MigrationsService } from "../../core/services/migrations";
import { IsAdmin } from "../../core/utils/guards";

const controller = "api/migrations";

@Controller(`/`)
export class MigrationsController {
	constructor(private readonly _MigrationsService: MigrationsService) {}

	@UseGuards(IsAdmin)
	@Get(`${controller}`)
	public async get(): Promise<void> {
		return this._MigrationsService.startMigrations();
	}
}
