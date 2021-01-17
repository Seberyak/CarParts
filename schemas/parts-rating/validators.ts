import Joi from "../../src/@input/joi";
import { IUserPartRate, UserPartRateSchema } from "./helper-schemas";
import { ObjectId } from "bson";

///---------------POST part rate

export const APOSTPartRatingSchema = Joi.object({
	partId: Joi.objectId().required(),
	value: Joi.number().required(),
});

export type IAPOSTPartRating = {
	partId: ObjectId;
	value: number;
};

export const RPOSTPartRatingSchema = UserPartRateSchema;

export type IRPOSTPartRating = IUserPartRate;

///---------------GET part rate

export const AGETPartRatingSchema = Joi.object({
	partId: Joi.objectId().required(),
});

export interface IAGETPartRating {
	partId: ObjectId;
}

export const RGETPartRatingSchema = UserPartRateSchema;

export type IRGETPartRating = IUserPartRate;

///---------------PUT part rate

export const APUTPartRatingSchema = APOSTPartRatingSchema;

export type IAPUTPartRating = IAPOSTPartRating;

export const RPUTPartRatingSchema = UserPartRateSchema;

export type IRPUTPartRating = IUserPartRate;

///---------------DELETE part rate

export const ADELETEPartRatingSchema = Joi.object({
	partId: Joi.objectId().required(),
});

export interface IADELETEPartRating {
	partId: ObjectId;
}

export const RDELETEPartRatingSchema = Joi.any().strip();

export type IRDELETEPartRating = void;
