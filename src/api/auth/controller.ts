import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IRPOSTLogin } from "../../../schemas/auth/validators";
import { JwtService } from "@nestjs/jwt";
import { docToObj } from "../../core/utils/db-config";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import {
	APOSTUserSchema,
	IAPOSTUser,
	IRPOSTUser,
} from "../../../schemas/user/validators";
import { AuthService } from "../../core/services/auth";

@Controller("api/auth")
export class AuthController {
	constructor(
		private readonly _JwtService: JwtService,
		private readonly _AuthService: AuthService
	) {}

	@UseGuards(AuthGuard("local"))
	@Post("/login")
	async login(@Request() req): Promise<IRPOSTLogin> {
		const user = JSON.parse(JSON.stringify(docToObj(req.user)));

		return { access_token: this._JwtService.sign(user) };
	}

	@Post("/register")
	async create(
		@wValidatedArg(APOSTUserSchema) args: IAPOSTUser
	): Promise<IRPOSTUser> {
		return this._AuthService.register(args);
	}
}
