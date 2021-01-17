import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ObjectIdPattern } from "../../core/utils/common";
import { wUser, wValidatedArg } from "../../core/utils/decorators/validation";
import {
	ADELETEPartRatingSchema,
	AGETPartRatingSchema,
	APOSTPartRatingSchema,
	APUTPartRatingSchema,
	IADELETEPartRating,
	IAGETPartRating,
	IAPOSTPartRating,
	IAPUTPartRating,
	IRDELETEPartRating,
	IRGETPartRating,
	IRPOSTPartRating,
	IRPUTPartRating,
} from "../../../schemas/parts-rating/validators";
import { IUser } from "../../../schemas/user/helper-schemas";
import { PartsRatingService } from "../../core/services/parts-rating";

@Controller("api/parts-rating")
export class PartsRatingController {
	constructor(private readonly _PartsRatingService: PartsRatingService) {}

	@Post("/")
	async create(
		@wValidatedArg(APOSTPartRatingSchema) args: IAPOSTPartRating,
		@wUser() user: IUser
	): Promise<IRPOSTPartRating> {
		return this._PartsRatingService.create(args, user);
	}

	@Get(`/:partId(${ObjectIdPattern})`)
	async get(
		@wValidatedArg(AGETPartRatingSchema) args: IAGETPartRating,
		@wUser() user: IUser
	): Promise<IRGETPartRating> {
		return this._PartsRatingService.get(args, user);
	}

	@Put("/")
	async update(
		@wValidatedArg(APUTPartRatingSchema) args: IAPUTPartRating,
		@wUser() user: IUser
	): Promise<IRPUTPartRating> {
		return this._PartsRatingService.update(args, user);
	}

	@Delete(`/:partId(${ObjectIdPattern})`)
	async delete(
		@wValidatedArg(ADELETEPartRatingSchema) args: IADELETEPartRating,
		@wUser() user: IUser
	): Promise<IRDELETEPartRating> {
		return this._PartsRatingService.delete(args, user);
	}
}
