import { Controller, UseGuards } from "@nestjs/common";
import { wUser, wValidatedArg } from "../../core/utils/decorators/validation";
import {
	ADELETEUserSchema,
	AGETManyUserSchema,
	AGETUserSchema,
	APUTUserSchema,
	IADELETEUser,
	IAGETManyUser,
	IAGETUser,
	IAPUTUser,
	IRDELETEUser,
	IRGETManyUser,
	IRGETUser,
	IRPUTUser,
} from "../../../schemas/user/validators";
import { UsersService } from "../../core/services/users";
import { ObjectIdPattern } from "../../core/utils/common";
import { IsAdmin } from "../../core/utils/guards";
import { IUser } from "../../../schemas/user/helper-schemas";
import {
	Delete,
	Get,
	Put,
} from "../../core/utils/decorators/custom-requests/request-mapping";

const controller = "api/users";

@Controller("/")
export class UsersController {
	constructor(private readonly _UsersService: UsersService) {}

	@UseGuards(IsAdmin)
	@Get(`${controller}/:_id(${ObjectIdPattern})`)
	async get(
		@wValidatedArg(AGETUserSchema) args: IAGETUser
	): Promise<IRGETUser> {
		return this._UsersService.get(args);
	}

	@UseGuards(IsAdmin)
	@Get(`${controller}/many`)
	async getMany(
		@wValidatedArg(AGETManyUserSchema) args: IAGETManyUser
	): Promise<IRGETManyUser> {
		return this._UsersService.getMany(args);
	}

	@Put(`${controller}/`)
	async update(
		@wValidatedArg(APUTUserSchema) args: IAPUTUser,
		@wUser() user: IUser
	): Promise<IRPUTUser> {
		return this._UsersService.update(args, user);
	}

	@UseGuards(IsAdmin)
	@Delete(`${controller}/:_id(${ObjectIdPattern})`)
	async deleteAll(
		@wValidatedArg(ADELETEUserSchema) args: IADELETEUser
	): Promise<IRDELETEUser> {
		return this._UsersService.delete(args);
	}
}
