import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { getTypegooseOptions } from "../../utils/db-config";
import {
	IAPaginated,
	IArgsManyId,
	IRPaginated,
	toInsertKeys,
} from "../../../../schemas/helper-schemas";
import { AbstractModel, getManyDocsFunc } from "./abstract";

@modelOptions(getTypegooseOptions("users"))
export class User implements Omit<IUser, toInsertKeys>, AbstractModel {
	@Prop()
	email: IUser["email"];

	@Prop()
	firstName: IUser["firstName"];

	@Prop()
	lastName: IUser["lastName"];

	@Prop()
	phoneNumber: IUser["phoneNumber"];

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;

	@Prop()
	password: IUser["password"];

	@Prop()
	type: IUser["type"];

	static getManyDocs(
		this: IUserModel,
		args: IArgsManyId & IAPaginated
	): Promise<IRPaginated<IUser>> {
		return getManyDocsFunc<IUser>(args, this);
	}
	@Prop()
	firebaseMetadata: IUser["firebaseMetadata"];
}
export type IUserModel = ReturnModelType<typeof User>;
