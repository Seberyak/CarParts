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
} from "../../../schemas/auth/validators";
import { AuthService } from "../../core/services/auth";

@Controller("api/auth")
export class AuthController {
	constructor(private readonly _AuthService: AuthService) {}

	@Post("/register")
	async create(
		@wValidatedArg(APOSTUserSchema) args: IAPOSTUser
	): Promise<IRPOSTUser> {
		return this._AuthService.create(args);
	}

	@Get("/:_id")
	async get(
		@wValidatedArg(AGETUserSchema) args: IAGETUser
	): Promise<IRGETUser> {
		return this._AuthService.get(args);
	}

	@Get("/many")
	async getMany(
		@wValidatedArg(AGETManyUserSchema) args: IAGETManyUser
	): Promise<IRGETManyUser> {
		return this._AuthService.getMany(args);
	}

	@Put("/:_id")
	async update(
		@wValidatedArg(APUTUserSchema) args: IAPUTUser
	): Promise<IRPUTUser> {
		return this._AuthService.update(args);
	}

	@Delete("/:_id")
	async deleteAll(
		@wValidatedArg(ADELETEUserSchema) args: IADELETEUser
	): Promise<IRDELETEUser> {
		return this._AuthService.delete(args);
	}
}
