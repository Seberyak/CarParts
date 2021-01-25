import { JwtService } from "@nestjs/jwt";
import { IDecodedUser } from "./decorators/validation";
import { getKeyFromFile } from "./crypt";
import { UserTypes } from "../../../schemas/user/user-types";
import { IFirebaseMetadata } from "../../../schemas/user/helper-schemas";
import { ObjectId } from "bson";

///

export const ObjectIdPattern = "[a-f0-9]{24}";

export function nullToUndefinedProperties(
	args: Record<string, any>
): Record<string, any> {
	const response = {};

	for (const key in args) {
		response[key] = args[key] ?? undefined;
	}
	return response;
}

export function deleteNullProperties(
	args: Record<string, any>
): Record<string, any> {
	const res: Record<string, any> = {};
	for (const key in args) {
		if (!!args[key]) {
			res[key] = args[key];
		}
	}
	return res;
}

export function undefinedToNullProperties(
	args: Record<string, any>,
	keys: string[]
): Record<string, any> {
	const response: Record<string, any> = {};
	for (const key of keys) {
		response[key] = args[key] ?? null;
	}
	return response;
}

export function getTokenFromUser(args: Record<string, any>): string {
	return new JwtService({ privateKey: getKeyFromFile() }).sign(
		nullToUndefinedProperties(args)
	);
}

export function getUserFromToken(accessToken: string): IDecodedUser {
	const decodedUser: Record<string, any> = new JwtService({
		privateKey: getKeyFromFile(),
	}).decode(accessToken) as IDecodedUser;

	// here don't know another method to get keys
	const a: IDecodedUser = {
		firstName: null,
		email: null,
		lastName: null,
		phoneNumber: "",
		type: UserTypes.Default,
		firebaseMetadata: {} as IFirebaseMetadata,
		_id: new ObjectId(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	const keys = Object.keys(a);

	return <IDecodedUser>undefinedToNullProperties(decodedUser, keys);
}
