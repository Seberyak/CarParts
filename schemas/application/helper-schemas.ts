import Joi from "../../src/@input/joi";

export const ApplicationSchemas = Joi.object({
	title: Joi.string().required(),
	category: Joi.string().required(),
	images: Joi.any(),
});

export interface IApplication {
	title: string;
	category: string;
	images?: any;
}
