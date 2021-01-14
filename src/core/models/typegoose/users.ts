import {
	getModelForClass,
	modelOptions,
	Prop,
	ReturnModelType,
} from "@typegoose/typegoose";
import { IUser } from "../../../../schemas/auth/helper-schemas";
import { getTypegooseOptions } from "../../utils/db-config";
import {
	IArgsManyId,
	IResponseDocsByManyId,
	toInsertKeys,
} from "../../../../schemas/helper-schemas";
import { AbstractModel, getManyDocsFunc } from "./abstract";

@modelOptions(getTypegooseOptions("users"))
export class User implements Omit<IUser, toInsertKeys>, AbstractModel {
	@Prop()
	mail: IUser["mail"];

	@Prop({ unique: true })
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

	static getManyDocs(
		args: IArgsManyId
	): Promise<IResponseDocsByManyId<IUser>> {
		return getManyDocsFunc(args, UserModel);
	}
}
export type IUserModel = ReturnModelType<typeof User>;

const UserModel = getModelForClass(User);
