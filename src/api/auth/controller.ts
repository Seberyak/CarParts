import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IRPOSTLogin } from "../../../schemas/auth/validators";
import { JwtService } from "@nestjs/jwt";
import { docToObj } from "../../core/utils/db-config";

@Controller("api/auth")
export class AuthController {
	constructor(private readonly _JwtService: JwtService) {}

	@UseGuards(AuthGuard("local"))
	@Post("/login")
	async login(@Request() req): Promise<IRPOSTLogin> {
		const user = docToObj(req.user);
		const { password, ...payload } = user;
		return { access_token: this._JwtService.sign(payload) };
	}
}
