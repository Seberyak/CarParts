import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { IUser } from "../../../../schemas/auth/helper-schemas";
import { getTypegooseOptions } from "../../utils/db-config";

@modelOptions(getTypegooseOptions("users123"))
export class User implements IUser {
	@Prop()
	eMail: IUser["eMail"];

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
}

export type UserModel = ReturnModelType<typeof User>;
