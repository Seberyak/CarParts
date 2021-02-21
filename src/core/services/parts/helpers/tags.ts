import { SqlArticlesHelper } from "../../sql-articles/helpers";
import { IAPOSTPart } from "../../../../../schemas/parts/validators";
import { IRCarsTree } from "../../../../../schemas/sql-articles/validators";
import {
	arrayToSqlQueryList,
	parseWordsFromString,
} from "../../../utils/common";
import { ECarManufacturerTypes } from "../../../../../schemas/sql-articles/helper-schemas";
import { Connection, EntityManager } from "typeorm";

interface IPartTags {
	tags: IAPOSTPart["tags"];
	oem: IAPOSTPart["oem"];
	productId: IAPOSTPart["productId"];
	supplier: IAPOSTPart["supplier"];
	modificationIds: IAPOSTPart["modificationIds"];
	manufacturerType: IAPOSTPart["manufacturerType"];
}

export class PartTags {
	private readonly tags: string[] = [];
	private readonly _SqlArticlesHelper: SqlArticlesHelper;
	private readonly manager: EntityManager;
	constructor(
		private readonly args: IPartTags,
		private readonly _Connection: Connection
	) {
		this.manager = this._Connection.manager;
		this._SqlArticlesHelper = new SqlArticlesHelper(this.manager);
		if (args.tags?.length > 0) this.tags = args.tags;
	}

	public async get(): Promise<string[]> {
		const { modificationIds, manufacturerType, productId } = this.args;

		const carsCategoriesTree = await this._SqlArticlesHelper.getCarsTreeByModificationIds(
			modificationIds,
			manufacturerType
		);

		this.tags.push(...this.parseCarsCategoriesTree(carsCategoriesTree));

		const nodeIds = await this.getNodesByProductId({
			carManufacturerType: manufacturerType,
			productId,
			modificationIds,
		});

		const promises: PromiseLike<any>[] = nodeIds.map(nodeId =>
			this._SqlArticlesHelper.getCategoriesTreeByNodeId({
				modificationIds,
				nodeId,
				type: manufacturerType,
			})
		);
		const partsCategoriesTrees = await Promise.all(promises);
		const categories = this.parsePartCategories(partsCategoriesTrees);
		this.tags.push(...categories, ...parseWordsFromString(categories));

		return [...new Set(this.tags)];
	}

	private async getNodesByProductId(args: {
		productId: number;
		modificationIds: number[];
		carManufacturerType: ECarManufacturerTypes;
	}): Promise<number[]> {
		const { productId, carManufacturerType, modificationIds } = args;
		const getNames = (
			type: ECarManufacturerTypes
		): { pds: string; modificationColumn: string } => {
			switch (type) {
				case ECarManufacturerTypes.passenger:
					return {
						modificationColumn: "passangercarid",
						pds: "passanger_car_pds",
					};
				case ECarManufacturerTypes.motorbike:
					return {
						modificationColumn: "motorbikeid",
						pds: "motorbike_pds",
					};
				case ECarManufacturerTypes.engine:
					return {
						modificationColumn: "engineid",
						pds: "engine_pds",
					};
				case ECarManufacturerTypes.commercial:
					return {
						modificationColumn: "commertialvehicleid",
						pds: "commercial_vehicle_pds",
					};
				case ECarManufacturerTypes.axle:
					return {
						modificationColumn: "axleid",
						pds: "axle_pds",
					};
			}
		};
		const { modificationColumn, pds } = getNames(carManufacturerType);
		const query = `select distinct nodeid nodeId from ${pds} where productid=${productId}
		 and ${modificationColumn} in ${arrayToSqlQueryList(modificationIds)}`;
		const tableResponse: { nodeId: number }[] = await this.manager.query(
			query
		);
		return tableResponse.map(el => el.nodeId);
	}

	private parseCarsCategoriesTree(data: IRCarsTree): string[] {
		const wordsSet = new Set<string>();

		for (const manufacturerKey in data) {
			const manufacturerObj = data[manufacturerKey];
			if (!manufacturerObj) break;
			wordsSet.add(manufacturerKey);
			parseWordsFromString(manufacturerKey).forEach(word =>
				wordsSet.add(word)
			);
			for (const modelKey in manufacturerObj) {
				const modelObj = manufacturerObj[modelKey];
				if (!modelObj) break;
				wordsSet.add(modelKey);
				parseWordsFromString(modelKey).forEach(word =>
					wordsSet.add(word)
				);
				modelObj.forEach(modification => {
					parseWordsFromString(modification).forEach(word =>
						wordsSet.add(word)
					);
				});
			}
		}
		return [...wordsSet];
	}

	private parsePartCategories(
		categoriesTrees: (Record<string, any> | string)[]
	): string[] {
		const keys: string[] = [];
		const deepSearch = (arg: Record<string, any> | string) => {
			if (typeof arg === "string") {
				keys.push(arg);
			} else if (typeof arg === "object") {
				keys.push(...Object.keys(arg));
				for (const key in arg) {
					if (arg.hasOwnProperty(key)) deepSearch(arg[key]);
				}
			}
		};

		for (const categoriesTree of categoriesTrees) {
			deepSearch(categoriesTree);
		}

		return keys;
	}
}
