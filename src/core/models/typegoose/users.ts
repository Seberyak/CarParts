import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { IUser } from "../../../../schemas/auth/helper-schemas";
import { getTypegooseOptions } from "../../utils/db-config";
import { toInsertKeys } from "../../../../schemas/helper-schemas";

@modelOptions(getTypegooseOptions("users"))
export class User implements Omit<IUser, toInsertKeys> {
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
}

export type IUserModel = ReturnModelType<typeof User>;
