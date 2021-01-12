import { IModelOptions } from "@typegoose/typegoose/lib/types";
import { Severity } from "@typegoose/typegoose";

export const getTypegooseOptions = (collectionName: string): IModelOptions => {
	return {
		schemaOptions: {
			collection: collectionName,
			timestamps: true,
			minimize: false,
		},
		options: {
			allowMixed: Severity.ALLOW,
		},
	};
};
