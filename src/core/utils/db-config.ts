import { DocumentType, IModelOptions } from "@typegoose/typegoose/lib/types";
import { Severity } from "@typegoose/typegoose";
import { IBasicDocument } from "../../../schemas/helper-schemas";

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

export function docToObj<T extends DocumentType<any>>(
	doc: T | null
): T extends DocumentType<infer R> ? R & IBasicDocument : any {
	if (doc === null) return null;
	if ((doc as any).constructor.name === "model") {
		return (doc as any).toObject();
	}
	return doc as any;
}
