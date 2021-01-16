import { ObjectId } from "bson";
import * as OriginalJoi from "joi";
import { ObjectSchema } from "joi";

type ObjectIdSchema = OriginalJoi.AnySchema;

export interface ExtendedAlternativesSchema
	extends OriginalJoi.AlternativesSchema {
	byKey: (key: string) => OriginalJoi.AlternativesSchema;
}

interface ExtendedJoi extends OriginalJoi.Root {
	objectId(): ObjectIdSchema;

	alternatives(types: OriginalJoi.SchemaLike[]): ExtendedAlternativesSchema;

	alternatives(
		...types: OriginalJoi.SchemaLike[]
	): ExtendedAlternativesSchema;
}

const Joi: ExtendedJoi = OriginalJoi.extend({
	type: "objectId",
	messages: {
		"objectId.base":
			"needs to be a string of 12 bytes or a string of 24 hex characters",
	},
	validate(value: unknown, helpers: any) {
		const isRequired = helpers.schema._flags.presence === "required";
		const error = helpers.error("objectId.base");

		const getError = (value: unknown) => {
			if (!isRequired && value === undefined) return null;
			if (!ObjectId.isValid(value as any)) {
				console.log(
					`\n\n****************************ObjectId ${value} validation error:\n`,
					JSON.stringify(error),
					"\n******************************\n\n"
				);
				return error;
			}
			return null;
		};
		return {
			value: new ObjectId(value as string),
			errors: getError(value),
		};
	},
})
	.extend({
		type: "object",
		base: OriginalJoi.object(),
		coerce: {
			from: "string",
			method(value: any, helpers: any) {
				if (value[0] !== "{" && !/^\s*\{/.test(value)) {
					return;
				}

				try {
					return { value: JSON.parse(value) };
				} catch (ignoreErr) {}
			},
		},
	})
	.extend({
		type: "array",
		base: OriginalJoi.array(),
		coerce: {
			from: "string",
			method(value: any, helpers: any) {
				if (
					typeof value !== "string" ||
					(value[0] !== "[" && !/^\s*\[/.test(value))
				) {
					return;
				}

				try {
					return { value: JSON.parse(value) };
				} catch (ignoreErr) {}
			},
		},
		rules: {
			uniquelize: {
				validate(initialValue: unknown[]) {
					const onlyUnique = (
						value: unknown,
						index: number,
						self: unknown[]
					) => self.indexOf(value) === index;
					return initialValue.filter(onlyUnique);
				},
			},
		},
	})
	.extend({
		type: "alternatives",
		base: OriginalJoi.alternatives(),
		rules: {
			byKey: {
				args: [
					{
						name: "key",
						ref: true,
						assert: (value: unknown) =>
							typeof value === "string" && !!value,
						message: "must be a string",
					},
				],
				method(this: OriginalJoi.AnySchema, key: string) {
					const flags = this._flags;
					return JoiAlternatives(key, { flags })(
						...this.$_terms.matches.map((e: any) => e.schema)
					);
				},
			},
		},
	});
const JoiAlternatives = (
	key: string,
	{ flags }: { flags: Record<any, any> }
) => (...schemas: OriginalJoi.AnySchema[]) => {
	if (schemas.length < 2) {
		return schemas[0];
	}
	const switches: OriginalJoi.SwitchCases[] = [];
	for (let i = 0; i < schemas.length; i++) {
		const schema = schemas[i];
		const isOneBeforeLast = i === schemas.length - 2;
		const casea: OriginalJoi.SwitchCases = {
			is: getPropertySchema(schema, key),
			then: schema,
		};
		switches.push(casea);
		if (isOneBeforeLast) {
			(casea as any).otherwise = schemas[i + 1];
			break;
		}
	}
	let finalSchema = Joi.alternatives().conditional("." + key, {
		switch: switches,
	});
	if (flags?.presence) {
		finalSchema = finalSchema.presence(flags.presence);
	}
	return finalSchema;
};

const getPropertySchema = (schema: OriginalJoi.AnySchema, key: string) => {
	return schema.$_reach([key]);
};

export interface IAnyObject {
	[key: string]: any;
}

export type JoiSchema = OriginalJoi.Schema;

export { Joi };
export default Joi;
export { ExtendedJoi };

export function getJoiObjectKeys<T extends ObjectSchema>(schema: T): string[] {
	if (
		typeof schema.$_terms === "object" &&
		typeof schema.$_terms.keys === "object"
	) {
		return schema.$_terms.keys.map((e: any) => e.key); // for Joi >= 16
	}
	return (schema as any)._inner.children.map((e: any) => e.key); // For Joi <= 15
}

export { ObjectId };
