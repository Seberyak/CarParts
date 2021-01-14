import { MError } from "./errors";

export function assertResourceExist<T extends any>(
	resource: T | null | undefined,
	resourceType: string
): asserts resource is T {
	if (typeof resource !== "boolean" && !resource) {
		throw new MError(404, `${resourceType.toLocaleUpperCase()} not found`);
	}
}
