import { Injectable } from "@nestjs/common";
import { Connection, EntityManager } from "typeorm";
import {
	ECarProducers,
	IAGETCarModels,
	IAGETCarModifications,
	IAGETCarProducers,
	ICarModificationsQueryData,
	IRGETCarModels,
	IRGETCarModifications,
	IRGETCarProducers,
} from "../../../../schemas/sql-articles/validators";

@Injectable()
export class SqlArticlesService {
	private manager: EntityManager;
	constructor(private readonly _Connection: Connection) {
		this.manager = this._Connection.manager;
	}

	public getCarProducers(
		args: IAGETCarProducers
	): Promise<IRGETCarProducers> {
		const { type } = args;
		const where = this.getWhereConditionByType(type);
		const order = type === "motorbike" ? "description" : "matchcode";
		const query = `SELECT id, description name FROM manufacturers 
		WHERE canbedisplayed = 'True' ${where} ORDER BY ${order}`;
		return this.manager.query(query);
	}

	public async getCarModels(args: IAGETCarModels): Promise<IRGETCarModels> {
		const { producerId, type, pattern, productionYear } = args;
		let where = this.getWhereConditionByType(type);
		if (!!pattern) where += `AND description LIKE '${pattern} %'`;

		const query = `SELECT id, description name, constructioninterval
		FROM models
		WHERE canbedisplayed = 'True'
		AND manufacturerid = ${producerId} ${where} ORDER BY description`;

		const data: IRGETCarModels = await this.manager.query(query);
		return !productionYear ? data : this.filterByYear(data, productionYear);
	}

	public async getModifications(
		args: IAGETCarModifications
	): Promise<IRGETCarModifications> {
		const { modelId, type, productionYear } = args;
		let query;
		switch (type) {
			case ECarProducers.passenger:
				// eslint-disable-next-line no-tabs
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue	
				FROM passanger_cars pc
				LEFT JOIN passanger_car_attributes a on pc.id = a.passangercarid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND ispassengercar = 'True'`;
				break;
			case ECarProducers.commercial:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM commercial_vehicles cv
				LEFT JOIN commercial_vehicle_attributes a on cv.id = a.commercialvehicleid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND iscommercialvehicle = 'True'`;
				break;
			case ECarProducers.motorbike:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM motorbikes m
				LEFT JOIN motorbike_attributes a on m.id = a.motorbikeid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND ismotorbike = 'True'`;
				break;
			case "engine":
				query = `SELECT id, fulldescription name, salesDescription, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM engines e
				LEFT JOIN engine_attributes a on e.id= a.engineid
				WHERE canbedisplayed = 'True'
				AND manufacturerId = ${modelId} AND isengine = 'True'`;
				break;
			case ECarProducers.axle:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM axles ax
				LEFT JOIN axle_attributes a on ax.id= a.axleid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND isaxle = 'True'`;
				break;
		}

		const data: ICarModificationsQueryData[] = await this.manager.query(
			query
		);

		let previousElement = {} as IRGETCarModifications[number];
		const response: IRGETCarModifications = data
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

		return !productionYear
			? response
			: this.filterByYear(response, productionYear);
	}

	private filterByYear<T extends { constructioninterval: string }>(
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

	protected getWhereConditionByType(type: ECarProducers): string {
		switch (type) {
			case ECarProducers.passenger:
				return " AND ispassengercar = 'True'";
			case ECarProducers.commercial:
				return " AND iscommercialvehicle = 'True'";
			case ECarProducers.motorbike:
				return " AND ismotorbike  = 'True' AND haslink = 'True'";
			case ECarProducers.engine:
				return " AND isengine = 'True'";
			case ECarProducers.axle:
				return " AND isaxle = 'True'";
		}
	}
}
