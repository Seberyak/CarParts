import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users";
import { IAPOSTUser, IRPOSTUser } from "../../../../schemas/user/validators";

@Injectable()
export class AuthService {
	constructor(
		private _UsersService: UsersService,
		private _JwtService: JwtService
	) {}
	public async register(args: IAPOSTUser): Promise<IRPOSTUser> {
		return this._UsersService.create(args);
	}
}
