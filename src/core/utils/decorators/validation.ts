import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import * as originalJoi from "joi";
import { AnySchema, ValidationOptions } from "joi";
import { MError } from "../errors";

const defaultReqPart: ReqPart[] = ["params", "query", "body"];

type Data = originalJoi.Schema | [originalJoi.Schema, ReqPart | ReqPart[]];

export const wValidatedArg = createParamDecorator(
	(data: Data, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest();
		const schema = Array.isArray(data) ? data[0] : data;
		const reqPart =
			(Array.isArray(data) ? data[1] : defaultReqPart) || defaultReqPart;
		const object = getObject(req, reqPart);
		return validateSchema(object, schema);
	}
);

type ReqPart = "params" | "query" | "body";

// eslint-disable-next-line sonarjs/cognitive-complexity
function getObject(
	req: Request,
	reqPart: ReqPart | ReqPart[] = ["params", "query", "body"]
) {
	if (Array.isArray(reqPart)) {
		reqPart = reqPart.filter(part => {
			const data = req[part];
			if (data === null || data === undefined) {
				return false;
			}
			if (!Array.isArray(data) && typeof data === "object") {
				if (Object.keys(data).length === 0) return false;
			}
			return true;
		});
		if (reqPart.length === 1) {
			reqPart = reqPart[0];
		}
	}
	let object: Record<any, any> = {};
	if (typeof reqPart === "string") {
		object = req[reqPart];
	} else {
		for (let i = 0; i < reqPart.length; ++i) {
			Object.assign(object, req[reqPart[i]]);
		}
	}
	return object;
}

function validateSchema<T>(
	obj: T,
	schema: AnySchema,
	options: ValidationOptions = {
		stripUnknown: true,
	}
): any {
	const validatorResult = schema.validate(obj, options);

	if (validatorResult.error || validatorResult.value === undefined) {
		throw new MError(403, validatorResult.error || {});
	}
	const { value } = validatorResult;
	if (value === undefined) {
		throw new MError(403, validatorResult.error || {});
	}
	return value;
}
