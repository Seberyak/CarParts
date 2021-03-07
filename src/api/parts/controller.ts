import { Controller } from "@nestjs/common";
import { PartsService } from "../../core/services/parts";
import { wUser, wValidatedArg } from "../../core/utils/decorators/validation";
import {
	ADELETEPartSchema,
	AGETManyPartSchema,
	AGETPartSchema,
	AGETSearchPartsSchema,
	APOSTPartSchema,
	APUTPartSchema,
	IADELETEPart,
	IAGETManyPart,
	IAGETPart,
	IAGETSearchParts,
	IAPOSTPart,
	IAPUTPart,
	IRDELETEPart,
	IRGETManyPart,
	IRGETPart,
	IRGETSearchParts,
	IRPOSTPart,
	IRPUTPart,
} from "../../../schemas/parts/validators";
import { ObjectIdPattern } from "../../core/utils/common";
import { IUser } from "../../../schemas/user/helper-schemas";
import { InjectModel } from "nestjs-typegoose";
import { IUserModel, User } from "../../core/models/typegoose/users";
import {
	Delete,
	Get,
	Post,
	Put,
} from "../../core/utils/decorators/custom-requests/request-mapping";

const controller = "api/parts";

@Controller("/")
export class PartsController {
	constructor(
		private readonly _PartsService: PartsService,
		@InjectModel(User)
		private readonly _UserModel: IUserModel
	) {}

	@Post(`${controller}/`)
	async create(
		@wValidatedArg(APOSTPartSchema) args: IAPOSTPart,
		@wUser(this._UserModel) user: IUser
	): Promise<IRPOSTPart> {
		return this._PartsService.create(args, user);
	}

	@Get(`${controller}/:_id(${ObjectIdPattern})`)
	async get(
		@wValidatedArg(AGETPartSchema) args: IAGETPart
	): Promise<IRGETPart> {
		return this._PartsService.get(args);
	}

	@Get(`${controller}/many`)
	async getMany(
		@wValidatedArg(AGETManyPartSchema) args: IAGETManyPart
	): Promise<IRGETManyPart> {
		return this._PartsService.getMany(args);
	}

	@Put(`${controller}/`)
	async update(
		@wValidatedArg(APUTPartSchema) args: IAPUTPart,
		@wUser() user: IUser
	): Promise<IRPUTPart> {
		return this._PartsService.update(args, user);
	}

	@Delete(`${controller}/:_id(${ObjectIdPattern})`)
	async delete(
		@wValidatedArg(ADELETEPartSchema) args: IADELETEPart,
		@wUser() user: IUser
	): Promise<IRDELETEPart> {
		return this._PartsService.delete(args, user);
	}

	@Get(`${controller}/search-parts`)
	async searchParts(
		@wValidatedArg(AGETSearchPartsSchema) args: IAGETSearchParts
	): Promise<IRGETSearchParts> {
		return this._PartsService.searchParts(args);
	}
}
