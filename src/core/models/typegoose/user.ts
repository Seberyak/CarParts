import { prop, ReturnModelType } from "@typegoose/typegoose";
import { IUser } from "../../../../schemas/auth/helper-schemas";

export class User implements IUser {
	@prop()
	eMail: IUser["eMail"];

	@prop()
	firstName: IUser["firstName"];

	@prop()
	lastName: IUser["lastName"];

	@prop()
	phoneNumber: IUser["phoneNumber"];

	@prop()
	createdAt: Date;

	@prop()
	updatedAt: Date;
}

export type UserModel = ReturnModelType<typeof User>;
