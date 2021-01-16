import { MError } from "./errors";
import { IUser } from "../../../schemas/user/helper-schemas";
import { ObjectId } from "bson";
import { UserTypes } from "../../../schemas/user/user-types";

export function assertResourceExist<T extends any>(
	resource: T | null | undefined,
	resourceType: string
): asserts resource is T {
	if (typeof resource !== "boolean" && !resource) {
		throw new MError(404, `${resourceType.toLocaleUpperCase()} not found`);
	}
}

export function assertUserHasPermission<
	T extends {
		author: ObjectId;
	}
>(user: IUser, resource: T): void | never {
	assertResourceExist(user, "user");
	assertResourceExist(resource, "resource");
	if (
		!user._id.equals(resource.author) &&
		!user.type.equals(UserTypes.Admin)
	) {
		throw new MError(403, "User has not permission");
	}
}
