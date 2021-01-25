import { Controller, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
	APOSTFirebaseLoginSchema,
	APOSTUserSchema,
	IAPOSTFirebaseLogin,
	IAPOSTUser,
	IRPOSTFirebaseLogin,
	IRPOSTLogin,
	IRPOSTUser,
} from "../../../schemas/auth/validators";
import { JwtService } from "@nestjs/jwt";
import { docToObj } from "../../core/utils/db-config";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import { AuthService } from "../../core/services/auth";
import { Post } from "../../core/utils/decorators/custom-requests/request-mapping";

const controller = "api/auth";

@Controller("/")
export class AuthController {
	constructor(
		private readonly _JwtService: JwtService,
		private readonly _AuthService: AuthService
	) {}

	@UseGuards(AuthGuard("local"))
	@Post(`${controller}/login`)
	async login(@Request() req): Promise<IRPOSTLogin> {
		const user = JSON.parse(JSON.stringify(docToObj(req.user)));

		return { "access-token": this._JwtService.sign(user) };
	}

	@Post(`${controller}/register`)
	async create(
		@wValidatedArg(APOSTUserSchema) args: IAPOSTUser
	): Promise<IRPOSTUser> {
		return this._AuthService.register(args);
	}

	@Post(`${controller}/firebase-login`)
	async firebaseLogin(
		@wValidatedArg(APOSTFirebaseLoginSchema) args: IAPOSTFirebaseLogin
	): Promise<IRPOSTFirebaseLogin> {
		return this._AuthService.firebaseLogin(args);
	}
}
