import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import {
	ADELETEUserSchema,
	AGETManyUserSchema,
	AGETUserSchema,
	APOSTUserSchema,
	APUTUserSchema,
	IADELETEUser,
	IAGETManyUser,
	IAGETUser,
	IAPOSTUser,
	IAPUTUser,
	IRDELETEUser,
	IRGETManyUser,
	IRGETUser,
	IRPOSTUser,
	IRPUTUser,
} from "../../../schemas/user/validators";
import { UsersService } from "../../core/services/users";
import { ObjectIdPattern } from "../../core/utils/common";

@Controller("api/users")
export class UsersController {
	constructor(private readonly _UsersService: UsersService) {}

	@Post("/register")
	async create(
		@wValidatedArg(APOSTUserSchema) args: IAPOSTUser
	): Promise<IRPOSTUser> {
		return this._UsersService.create(args);
	}

	@Get(`/:_id(${ObjectIdPattern})`)
	async get(
		@wValidatedArg(AGETUserSchema) args: IAGETUser
	): Promise<IRGETUser> {
		return this._UsersService.get(args);
	}

	@Get("/many")
	async getMany(
		@wValidatedArg(AGETManyUserSchema) args: IAGETManyUser
	): Promise<IRGETManyUser> {
		return this._UsersService.getMany(args);
	}

	@Put(`/:_id(${ObjectIdPattern})`)
	async update(
		@wValidatedArg(APUTUserSchema) args: IAPUTUser
	): Promise<IRPUTUser> {
		return this._UsersService.update(args);
	}

	@Delete(`/:_id(${ObjectIdPattern})`)
	async deleteAll(
		@wValidatedArg(ADELETEUserSchema) args: IADELETEUser
	): Promise<IRDELETEUser> {
		return this._UsersService.delete(args);
	}
}
