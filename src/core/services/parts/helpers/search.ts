import { IAGETSearchParts } from "../../../../../schemas/parts/validators";
import { ECarManufacturerTypes } from "../../../../../schemas/sql-articles/helper-schemas";
import { parseWordsFromString } from "../../../utils/common";

export class SearchPartsHelper {
	private readonly query: Record<string, any> = {};

	constructor(args: IAGETSearchParts) {
		const {
			manufacturerType,
			price,
			searchableText,
			modificationIds,
			productId,
		} = args;

		if (!!manufacturerType) {
			this.query["manufacturerType"] = manufacturerType;
		}
		if (!!price) {
			this.query["price"] = this.getPriceQuery(price);
		}
		if (!!searchableText) {
			const searchableWords = parseWordsFromString(
				searchableText
			).map(word => word.toLowerCase());
			this.query = {
				...this.query,
				...this.getSearchableTextQuery(searchableText),
			};
		}
		if (!!modificationIds) {
			this.query["modificationIds"] = { $in: modificationIds };
		}
		if (!!productId) {
			this.query["productId"] = productId;
		}
	}

	public getQuery(): Record<string, any> {
		return this.query;
	}

	private getPriceQuery(
		args: IAGETSearchParts["price"]
	): { $gte: number; $lt: number } {
		let { max: maxPrice, min: minPrice } = args;
		if (maxPrice < minPrice) [maxPrice, minPrice] = [minPrice, maxPrice];
		return { $gte: minPrice, $lt: maxPrice };
	}
	private getSearchableTextQuery(args: string): { $or: any[] } {
		const queryArg = { $regex: `${args}`, $options: "i" };
		const inOem = { oem: queryArg };
		const inTitle = { title: queryArg };
		const inDescription = { description: queryArg };
		const inTags = { tags: queryArg };

		return { $or: [inOem, inTitle, inDescription, inTags] };
	}
}
