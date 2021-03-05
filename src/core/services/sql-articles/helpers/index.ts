import {
	ICarModificationsQueryData,
	IRGETCarModifications,
	ICarsTreeManufacturerLevel,
	ICarsTreeModelLevel,
	ICarsTreeModificationLevel,
	ICarsTreeRawElement,
	ICarsTreeRawData,
	IRCarsTree,
} from "../../../../../schemas/sql-articles/validators";
import { ECarManufacturerTypes } from "../../../../../schemas/sql-articles/helper-schemas";
import { assertResourceExist } from "../../../utils/asserts";
import { EntityManager } from "typeorm";
import { arrayToSqlQueryList } from "../../../utils/common";

export class SqlArticlesHelper {
	constructor(public readonly manager: EntityManager) {}

	public async getCarsTreeByModificationIds(
		ids: number[],
		type: ECarManufacturerTypes
	): Promise<IRCarsTree> {
		let table: string;
		switch (type) {
			case ECarManufacturerTypes.passenger:
				table = "passanger_cars";
				break;
			case ECarManufacturerTypes.commercial:
				table = "commercial_vehicles";
				break;
			case ECarManufacturerTypes.motorbike:
				table = "commercial_vehicles";
				break;
			case ECarManufacturerTypes.axle:
				table = "axles";
				break;
			case ECarManufacturerTypes.engine:
				assertResourceExist(undefined, "part");
				break;
		}
		const query = `select distinct mfct.id manufacturerId, mfct.description manufacturer, m.id modelId, m.description  model,
       mdf.id modificationId ,mdf.description modification, mdf.constructioninterval from ${table} mdf
       join models m on mdf.modelid=m.id join manufacturers mfct on m.manufacturerid=mfct.id
       where mdf.id in  ${arrayToSqlQueryList(ids)}`;

		const data: ICarsTreeRawData = await this.manager.query(query);
		return this.createCarsTreeByQueryData(data);
	}

	public async getCarFullNamesByModificationIds(
		ids: number[],
		type: ECarManufacturerTypes
	): Promise<string[]> {
		let table: string;
		switch (type) {
			case ECarManufacturerTypes.passenger:
				table = "passanger_cars";
				break;
			case ECarManufacturerTypes.commercial:
				table = "commercial_vehicles";
				break;
			case ECarManufacturerTypes.motorbike:
				table = "commercial_vehicles";
				break;
			case ECarManufacturerTypes.axle:
				table = "axles";
				break;
			case ECarManufacturerTypes.engine:
				assertResourceExist(undefined, "part");
				break;
		}
		const query = `select distinct concat_ws(' : ', mdf.fulldescription,mdf.constructioninterval)
		 as name from ${table} mdf join models m on mdf.modelid=m.id join manufacturers
		 mfct on m.manufacturerid=mfct.id where mdf.id in ${arrayToSqlQueryList(ids)}`;

		const res: { name: string }[] = await this.manager.query(query);
		return res.map(el => el.name);
	}

	public createCarsTreeByQueryData(args: ICarsTreeRawData): IRCarsTree {
		const res: IRCarsTree = {};
		const manufacturersSet = new Set<number>();
		const modelsSet = new Set<number>();
		const modificationsSet = new Set<number>();
		args.forEach(el => {
			if (manufacturersSet.has(el.manufacturerId)) {
				if (
					modelsSet.has(el.modelId) &&
					!modificationsSet.has(el.modificationId)
				) {
					res[el.manufacturer][el.model].push(
						this.getNewCarTreeModificationLevel(el)
					);
				} else {
					res[el.manufacturer][
						el.model
					] = this.getNewCarTreeModelLevel(el);
				}
			} else {
				res[el.manufacturer] = this.getNewCarTreeManufacturerLevel(el);
			}
			manufacturersSet.add(el.manufacturerId);
			modelsSet.add(el.modelId);
			modificationsSet.add(el.modificationId);
		});

		return res;
	}

	public groupModificationsById(
		args: ICarModificationsQueryData[]
	): IRGETCarModifications {
		let previousElement = {} as IRGETCarModifications[number];
		return args
			.map(el => {
				if (el.id !== previousElement?.id) {
					previousElement = {
						id: el.id,
						name: el.name,
						constructioninterval: "",
					};
				}
				if (el.attributetype === "ConstructionInterval") {
					previousElement.constructioninterval = el.displayvalue;
					return { ...previousElement };
				}
				return undefined;
			})
			.filter(el => !!el);
	}

	//// get car manufacturer type by comparing elements and getting max length of same linkageTypeId
	/*public getCarManufacturerTypeFromGroupedArticleLinks(
		args: IGroupByLinkageType
	): ECarManufacturerTypes {
		const res: { type: ECarManufacturerTypes; length: number }[] = [];
		for (const key in args) {
			if (args.hasOwnProperty(key)) {
				res.push({
					type: ECarManufacturerTypes[key],
					length: args[key].length,
				});
			}
		}
		const sorted = res.sort((a, b) => {
			return b.length - a.length;
		});

		return sorted[0].type;
	}*/

	public filterByYear<T extends { constructioninterval: string }>(
		data: T[],
		productionYear: number
	): T[] {
		return data.filter(el => {
			const range = el.constructioninterval;
			const dashIndex = range.indexOf("-");
			const startProductionYear = parseInt(
				range.slice(dashIndex - 5, dashIndex - 1)
			);
			const endProductionYear =
				range.length - dashIndex >= 9
					? parseInt(range.slice(dashIndex + 5, dashIndex + 9))
					: new Date().getFullYear();

			return !!(
				productionYear >= startProductionYear &&
				productionYear <= endProductionYear
			);
		});
	}

	public getWhereConditionByType(type: ECarManufacturerTypes): string {
		switch (type) {
			case ECarManufacturerTypes.passenger:
				return " AND ispassengercar = 'True'";
			case ECarManufacturerTypes.commercial:
				return " AND iscommercialvehicle = 'True'";
			case ECarManufacturerTypes.motorbike:
				return " AND ismotorbike  = 'True' AND haslink = 'True'";
			case ECarManufacturerTypes.engine:
				return " AND isengine = 'True'";
			case ECarManufacturerTypes.axle:
				return " AND isaxle = 'True'";
		}
	}

	/*
	public groupByLinkageType(
		articleLinks: IArticleLinks[]
	): IGroupByLinkageType {
		const grouped: IGroupByLinkageType = {
			passenger: [],
			axle: [],
			commercial: [],
			engine: [],
			motorbike: [],
		};
		articleLinks.forEach(el => {
			const type = ELinkageTypes[el.linkagetypeid];
			if (!!type) {
				grouped[type].push(el);
			}
		});
		return grouped;
	}
	
 */

	public async getCategoriesTreeByNodeId(args: {
		nodeId: number;
		modificationIds: number[];
		type: ECarManufacturerTypes;
	}): Promise<any> {
		const { nodeId, type, modificationIds } = args;
		let [table, modificationIdColumnName] = ["", ""];
		switch (type) {
			case ECarManufacturerTypes.passenger:
				[table, modificationIdColumnName] = [
					"passanger_car_trees",
					"passangercarid",
				];
				break;
			case ECarManufacturerTypes.commercial:
				[table, modificationIdColumnName] = [
					"commercial_vehicle_trees",
					"commercialvehicleid",
				];
				break;
			case ECarManufacturerTypes.axle:
				[table, modificationIdColumnName] = ["axle_trees", "axleid"];
				break;
			case ECarManufacturerTypes.motorbike:
				[table, modificationIdColumnName] = [
					"motorbike_trees",
					"motorbikeid",
				];
				break;
			case ECarManufacturerTypes.engine:
				[table, modificationIdColumnName] = [
					"engine_trees",
					"engineid",
				];
				break;
		}

		const recursionSearch = async (args1: {
			id: number;
			modificationId;
			table: string;
			modificationIdName: string;
		}): Promise<any> => {
			const res: Record<string, any> = {};
			const query = `select id,parentid,description  from ${args1.table} 
			where id=${args1.id} and ${args1.modificationIdName} 
			in ${arrayToSqlQueryList(args1.modificationId)}`;
			const categories: {
				id: number;
				parentid: number;
				description: string;
			} = await this.manager.query(query).then(res => res[0]);
			if (categories.parentid !== 0) {
				res[categories.description] = await recursionSearch({
					modificationId: args1.modificationId,
					modificationIdName: args1.modificationIdName,
					table: args1.table,
					id: categories.parentid,
				});
			}
			return !!categories.parentid ? res : categories.description;
		};

		return await recursionSearch({
			id: nodeId,
			modificationId: modificationIds,
			table: table,
			modificationIdName: modificationIdColumnName,
		});
	}

	private getNewCarTreeManufacturerLevel(
		args: ICarsTreeRawElement
	): ICarsTreeManufacturerLevel {
		return {
			[args.model]: this.getNewCarTreeModelLevel(args),
		};
	}

	private getNewCarTreeModelLevel(
		args: ICarsTreeRawElement
	): ICarsTreeModelLevel {
		return [this.getNewCarTreeModificationLevel(args)];
	}
	private getNewCarTreeModificationLevel(
		args: ICarsTreeRawElement
	): ICarsTreeModificationLevel {
		return args.modification + ` : ` + args.constructioninterval;
	}
}
