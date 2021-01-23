import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MError } from "./errors";
import {
	DecodedUserSchema,
	IDecodedUser,
	validateSchema,
} from "./decorators/validation";
import { UserTypes } from "../../../schemas/user/user-types";

export class IsAdmin implements CanActivate {
	canActivate(ctx: ExecutionContext): boolean {
		const req = ctx.switchToHttp().getRequest();
		const access_token = req.headers["access-token"];
		console.log(req.headers);
		const decodedUser: Record<string, any> = new JwtService({}).decode(
			access_token
		) as any;
		if (!decodedUser?._id) {
			throw new MError(401, "Authentication Failed");
		}
		const user: IDecodedUser = validateSchema(
			decodedUser,
			DecodedUserSchema
		);

		if (!user.type.equals(UserTypes.Admin)) {
			throw new MError(403, "Not Authorized");
		}
		return true;
	}
}
