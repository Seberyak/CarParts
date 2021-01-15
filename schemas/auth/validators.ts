///---------------POST Login

import Joi from "../../src/@input/joi";

export const APOSTLoginSchema = Joi.object({
	mail: Joi.string()
		.email()
		.required(),
	password: Joi.string().required(),
});

export interface IAPOSTLogin {
	mail: string;
	password: string;
}

export const RPOSTLoginSchema = Joi.object({
	access_token: Joi.string().required(),
});

export interface IRPOSTLogin {
	access_token: string;
}
