import {
	IArticleLinks,
	ICarModificationsQueryData,
	IGroupByLinkageType,
	IRGETCarModifications,
} from "../../../../../schemas/sql-articles/validators";
import {
	ECarProducerTypes,
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

	//// get car producer type by comparing elements and getting max length of same linkageTypeId
	public getCarProducerTypeFromGroupedArticleLinks(
		args: IGroupByLinkageType
	): ECarProducerTypes {
		const res: { type: ECarProducerTypes; length: number }[] = [];
		for (const key in args) {
			if (args.hasOwnProperty(key)) {
				res.push({
					type: ECarProducerTypes[key],
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

	public getWhereConditionByType(type: ECarProducerTypes): string {
		switch (type) {
			case ECarProducerTypes.passenger:
				return " AND ispassengercar = 'True'";
			case ECarProducerTypes.commercial:
				return " AND iscommercialvehicle = 'True'";
			case ECarProducerTypes.motorbike:
				return " AND ismotorbike  = 'True' AND haslink = 'True'";
			case ECarProducerTypes.engine:
				return " AND isengine = 'True'";
			case ECarProducerTypes.axle:
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
}
