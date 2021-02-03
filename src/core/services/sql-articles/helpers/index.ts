import {
	IArticleLinks,
	ICarModificationsQueryData,
	IGroupByLinkageType,
	IRGETCarModifications,
	ICarsTreeManufacturerLevel,
	ICarsTreeModelLevel,
	ICarsTreeModificationLevel,
	ICarsTreeRawElement,
	ICarsTreeRawData,
	IRCarsTree,
} from "../../../../../schemas/sql-articles/validators";
import {
	ECarManufacturerTypes,
	ELinkageTypes,
} from "../../../../../schemas/sql-articles/helper-schemas";

export class SqlArticlesHelper {
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
	public getCarManufacturerTypeFromGroupedArticleLinks(
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
	}

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
	public arrayToSqlQueryList(arr: string[] | number[]): string {
		let res = `(`;
		arr.forEach(el => {
			if (typeof el === "number") el = el.toString();
			res += `${el}, `;
		});
		res = res.slice(0, res.length - 2);
		res += ")";
		return res;
	}

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
					res[el.manufacturer][el.model][
						el.modification
					] = this.getNewCarTreeModificationLevel(el);
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
		return {
			[args.modification]: this.getNewCarTreeModificationLevel(args),
		};
	}
	private getNewCarTreeModificationLevel(
		args: ICarsTreeRawElement
	): ICarsTreeModificationLevel {
		return {
			constructioninterval: args.constructioninterval,
		};
	}
}
