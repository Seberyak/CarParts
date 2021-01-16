import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { PartsService } from "../../core/services/parts";
import { wUser, wValidatedArg } from "../../core/utils/decorators/validation";
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
import { IUser } from "../../../schemas/user/helper-schemas";
import { InjectModel } from "nestjs-typegoose";
import { IUserModel, User } from "../../core/models/typegoose/users";

@Controller("api/parts/")
export class PartsController {
	constructor(
		private readonly _PartsService: PartsService,
		@InjectModel(User)
		private readonly _UserModel: IUserModel
	) {}

	@Post("/")
	async create(
		@wValidatedArg(APOSTPartSchema) args: IAPOSTPart,
		@wUser(this._UserModel) user: IUser
	): Promise<IRPOSTPart> {
		return this._PartsService.create(args, user);
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

	@Put(`/`)
	async update(
		@wValidatedArg(APUTPartSchema) args: IAPUTPart,
		@wUser() user: IUser
	): Promise<IRPUTPart> {
		return this._PartsService.update(args, user);
	}

	@Delete(`/:_id(${ObjectIdPattern})`)
	async delete(
		@wValidatedArg(ADELETEPartSchema) args: IADELETEPart,
		@wUser() user: IUser
	): Promise<IRDELETEPart> {
		return this._PartsService.delete(args, user);
	}
}
