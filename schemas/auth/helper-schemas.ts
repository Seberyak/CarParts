import Joi from "../../src/@input/joi";

export const UserSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	phoneNumber: Joi.string().required(),
	mail: Joi.string()
		.email()
		.required(),
	password: Joi.string()
		.min(8)
		.max(16)
		.required(),
});

export interface IUser {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	mail: string;
	password: string;
}
