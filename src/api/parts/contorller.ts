import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { PartsService } from "../../core/services/parts";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import {
	ADELETEPartSchema,
	AGETManyPartSchema,
	AGETPartSchema,
	APOSTPartSchema,
	APUTPartSchema,
	IADELETEPart,
	IAGETManyPart,
	IAGETPart,
	IAPOSTPart,
	IAPUTPart,
	IRDELETEPart,
	IRGETManyPart,
	IRGETPart,
	IRPOSTPart,
	IRPUTPart,
} from "../../../schemas/parts/validators";
import { ObjectIdPattern } from "../../core/utils/common";

@Controller("api/parts/")
export class PartsController {
	constructor(private readonly _PartsService: PartsService) {}

	@Post("/")
	async create(
		@wValidatedArg(APOSTPartSchema) args: IAPOSTPart
	): Promise<IRPOSTPart> {
		return this._PartsService.create(args);
	}

	@Get(`/:_id(${ObjectIdPattern})`)
	async get(
		@wValidatedArg(AGETPartSchema) args: IAGETPart
	): Promise<IRGETPart> {
		return this._PartsService.get(args);
	}

	@Get("/many")
	async getMany(
		@wValidatedArg(AGETManyPartSchema) args: IAGETManyPart
	): Promise<IRGETManyPart> {
		return this._PartsService.getMany(args);
	}

	@Put("/")
	async update(
		@wValidatedArg(APUTPartSchema) args: IAPUTPart
	): Promise<IRPUTPart> {
		return this._PartsService.update(args);
	}

	@Delete(`/:_id(${ObjectIdPattern})`)
	async delete(
		@wValidatedArg(ADELETEPartSchema) args: IADELETEPart
	): Promise<IRDELETEPart> {
		return this._PartsService.delete(args);
	}
}
