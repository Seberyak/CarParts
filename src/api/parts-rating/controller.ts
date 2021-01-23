import { Controller, UseGuards } from "@nestjs/common";
import { ObjectIdPattern } from "../../core/utils/common";
import { wUser, wValidatedArg } from "../../core/utils/decorators/validation";
import {
	ADELETEPartRatingSchema,
	AGETManyPartRatingSchema,
	AGETPartRatingSchema,
	APOSTPartRatingSchema,
	APUTPartRatingSchema,
	IADELETEPartRating,
	IAGETManyPartRating,
	IAGETPartRating,
	IAPOSTPartRating,
	IAPUTPartRating,
	IRDELETEPartRating,
	IRGETManyPartRating,
	IRGETPartRating,
	IRPOSTPartRating,
	IRPUTPartRating,
} from "../../../schemas/parts-rating/validators";
import { IUser } from "../../../schemas/user/helper-schemas";
import { PartsRatingService } from "../../core/services/parts-rating";
import { IsAdmin } from "../../core/utils/guards";
import {
	Delete,
	Get,
	Post,
	Put,
} from "../../core/utils/decorators/custom-requests/request-mapping";

const controller = "api/parts-rating";

@Controller("/")
export class PartsRatingController {
	constructor(private readonly _PartsRatingService: PartsRatingService) {}

	@Post(`${controller}/`)
	async create(
		@wValidatedArg(APOSTPartRatingSchema) args: IAPOSTPartRating,
		@wUser() user: IUser
	): Promise<IRPOSTPartRating> {
		return this._PartsRatingService.create(args, user);
	}

	@Get(`${controller}/:partId(${ObjectIdPattern})`)
	async get(
		@wValidatedArg(AGETPartRatingSchema) args: IAGETPartRating,
		@wUser() user: IUser
	): Promise<IRGETPartRating> {
		return this._PartsRatingService.get(args, user);
	}

	@UseGuards(IsAdmin)
	@Get(`${controller}/many`)
	async getMany(
		@wValidatedArg(AGETManyPartRatingSchema) args: IAGETManyPartRating
	): Promise<IRGETManyPartRating> {
		return this._PartsRatingService.getMany(args);
	}

	@Put(`${controller}/`)
	async update(
		@wValidatedArg(APUTPartRatingSchema) args: IAPUTPartRating,
		@wUser() user: IUser
	): Promise<IRPUTPartRating> {
		return this._PartsRatingService.update(args, user);
	}

	@Delete(`${controller}/:partId(${ObjectIdPattern})`)
	async delete(
		@wValidatedArg(ADELETEPartRatingSchema) args: IADELETEPartRating,
		@wUser() user: IUser
	): Promise<IRDELETEPartRating> {
		return this._PartsRatingService.delete(args, user);
	}
}
