import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { getTypegooseOptions } from "../../utils/db-config";
import {
	IArgsManyId,
	IRPaginated,
	toInsertKeys,
} from "../../../../schemas/helper-schemas";
import { AbstractModel, getManyDocsFunc } from "./abstract";

@modelOptions(getTypegooseOptions("users"))
export class User implements Omit<IUser, toInsertKeys>, AbstractModel {
	@Prop({ unique: true })
	mail: IUser["mail"];

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
		args: IArgsManyId
	): Promise<IRPaginated<IUser>> {
		return getManyDocsFunc(args, this);
	}
}
export type IUserModel = ReturnModelType<typeof User>;
