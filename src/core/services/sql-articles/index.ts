import { Injectable } from "@nestjs/common";
import { Connection, EntityManager } from "typeorm";
import {
	ECarProducers,
	IAGETCarModels,
	IAGETCarModifications,
	IAGETCarProducers,
	IAGETPartCategories,
	IAGETSectionParts,
	ICarModificationsQueryData,
	IRGETCarModels,
	IRGETCarModifications,
	IRGETCarProducers,
	IRGETSectionParts,
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

	public async getPartCategories(args: IAGETPartCategories): Promise<any> {
		const getQuery = (args: IAGETPartCategories): string => {
			const { modificationId, type } = args;
			const parentId = args.parentId ?? 0;
			switch (type) {
				case ECarProducers.passenger:
					return `select id,description from passanger_car_trees where passangercarid=${modificationId} and parentid = ${parentId}`;

				case ECarProducers.commercial:
					return `select id,description from commercial_vehicle_trees where commercialvehicleid=${modificationId} and parentid = ${parentId}`;

				case ECarProducers.motorbike:
					return `Sselect id,description from motorbike_trees where motorbikeid=${modificationId} and parentid = ${parentId}`;

				case ECarProducers.engine:
					return `select id,description from engine_trees where engineid=${modificationId} and parentid = ${parentId}`;

				case ECarProducers.axle:
					return `select id,description from axle_trees where axleid=${modificationId} and parentid = ${parentId}`;
			}
		};
		const query = getQuery(args);
		return this.manager.query(query);
	}

	// eslint-disable-next-line max-lines-per-function
	public async getPartsBySection(
		args: IAGETSectionParts
	): Promise<IRGETSectionParts> {
		const getQuery = (args: IAGETSectionParts): string => {
			const { modificationId, sectionId, type } = args;
			switch (type) {
				case ECarProducers.passenger:
					return `SELECT al.datasupplierarticlenumber part_number,
				s.description supplier_name, prd.description product_name
				FROM article_links al
				JOIN passanger_car_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN passanger_car_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.passangercarid
				AND al.linkageid = ${modificationId}
				AND pds.nodeid = ${sectionId}
				AND al.linkagetypeid = 2
				ORDER BY s.description, al.datasupplierarticlenumber`;

				case ECarProducers.commercial:
					return `SELECT al.datasupplierarticlenumber part_number,
				s.description supplier_name, prd.description product_name
				FROM article_links al
				JOIN commercial_vehicle_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN commercial_vehicle_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.commertialvehicleid
				AND al.linkageid = ${modificationId}
				AND pds.nodeid = ${sectionId}
				AND al.linkagetypeid = 16
				ORDER BY s.description, al.datasupplierarticlenumber`;

				case ECarProducers.motorbike:
					return `SELECT al.datasupplierarticlenumber part_number,
				s.description supplier_name, prd.description product_name
				FROM article_links al
				JOIN motorbike_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN motorbike_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.motorbikeid
				AND al.linkageid = ${modificationId}
				AND pds.nodeid = ${sectionId}
				AND al.linkagetypeid = 777
				ORDER BY s.description, al.datasupplierarticlenumber`;

				case ECarProducers.engine:
					return `SELECT pds.engineid, al.datasupplierarticlenumber part_number,
				prd.description product_name, s.description supplier_name
				FROM article_links al
				JOIN engine_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN engine_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.engineid
				AND al.linkageid = ${modificationId}
				AND pds.nodeid = ${sectionId}
				AND al.linkagetypeid = 14
				ORDER BY s.description, al.datasupplierarticlenumber`;

				case ECarProducers.axle:
					return `SELECT pds.axleid, al.datasupplierarticlenumber part_number,
				prd.description product_name, s.description supplier_name
				FROM article_links al
				JOIN axle_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN axle_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.axleid
				AND al.linkageid = ${modificationId}
				AND pds.nodeid = ${sectionId}
				AND al.linkagetypeid = 19
				ORDER BY s.description, al.datasupplierarticlenumber`;
			}
		};
		const query = getQuery(args);
		return this.manager.query(query);
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
