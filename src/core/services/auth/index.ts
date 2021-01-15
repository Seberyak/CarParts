import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users";

@Injectable()
export class AuthService {
	constructor(
		private _UsersService: UsersService,
		private _JwtService: JwtService
	) {}
}
