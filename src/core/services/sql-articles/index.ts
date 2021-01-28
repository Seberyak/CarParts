import { Injectable } from "@nestjs/common";
import { Connection, EntityManager } from "typeorm";
import {
	IAGETAutocompleteByOem,
	IAGETCarModels,
	IAGETCarModifications,
	IAGETCarProducers,
	IAGETPartCategories,
	IAGETSectionParts,
	IArticleLinks,
	ICarModificationsQueryData,
	IRGETCarModels,
	IRGETCarModifications,
	IRGETCarProducers,
	IRGETPartCategories,
	IRGETSectionParts,
} from "../../../../schemas/sql-articles/validators";
import { ECarProducerTypes } from "../../../../schemas/sql-articles/helper-schemas";
import { SqlArticlesHelper } from "./helpers";

@Injectable()
export class SqlArticlesService {
	private manager: EntityManager;
	private Helper;
	constructor(private readonly _Connection: Connection) {
		this.manager = this._Connection.manager;
		this.Helper = new SqlArticlesHelper();
	}

	public getCarProducers(
		args: IAGETCarProducers
	): Promise<IRGETCarProducers> {
		const { type } = args;
		const where = this.Helper.getWhereConditionByType(type);
		const order = type === "motorbike" ? "description" : "matchcode";
		const query = `SELECT id, description name FROM manufacturers 
		WHERE canbedisplayed = 'True' ${where} ORDER BY ${order}`;
		return this.manager.query(query);
	}

	public async getCarModels(args: IAGETCarModels): Promise<IRGETCarModels> {
		const { producerId, type, pattern, productionYear } = args;
		let where = this.Helper.getWhereConditionByType(type);
		if (!!pattern) where += `AND description LIKE '${pattern} %'`;

		const query = `SELECT id, description name, constructioninterval
		FROM models
		WHERE canbedisplayed = 'True'
		AND manufacturerid = ${producerId} ${where} ORDER BY description`;

		const data: IRGETCarModels = await this.manager.query(query);
		return !productionYear
			? data
			: this.Helper.filterByYear(data, productionYear);
	}

	public async getModifications(
		args: IAGETCarModifications
	): Promise<IRGETCarModifications> {
		const { modelId, type, productionYear } = args;
		let query;
		switch (type) {
			case ECarProducerTypes.passenger:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype,
				a.displaytitle, a.displayvalue FROM passanger_cars pc
				LEFT JOIN passanger_car_attributes a on pc.id = a.passangercarid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND ispassengercar = 'True'`;
				break;
			case ECarProducerTypes.commercial:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM commercial_vehicles cv
				LEFT JOIN commercial_vehicle_attributes a on cv.id = a.commercialvehicleid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND iscommercialvehicle = 'True'`;
				break;
			case ECarProducerTypes.motorbike:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM motorbikes m
				LEFT JOIN motorbike_attributes a on m.id = a.motorbikeid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND ismotorbike = 'True'`;
				break;
			case ECarProducerTypes.engine:
				query = `SELECT id, fulldescription name, salesDescription, a.attributegroup,
				a.attributetype, a.displaytitle, a.displayvalue FROM engines e
				LEFT JOIN engine_attributes a on e.id= a.engineid
				WHERE canbedisplayed = 'True'
				AND manufacturerId = ${modelId} AND isengine = 'True'`;
				break;
			case ECarProducerTypes.axle:
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

		const response: IRGETCarModifications = this.Helper.groupModificationsById(
			data
		);
		return !productionYear
			? response
			: this.Helper.filterByYear(response, productionYear);
	}

	public async getPartCategories(
		args: IAGETPartCategories
	): Promise<IRGETPartCategories> {
		const getQuery = (partCategoriesArgs: IAGETPartCategories): string => {
			const { modificationId, type } = partCategoriesArgs;
			const parentId = partCategoriesArgs.parentId ?? 0;
			switch (type) {
				case ECarProducerTypes.passenger:
					return `select id,description from passanger_car_trees where passangercarid=${modificationId} and parentid = ${parentId}`;

				case ECarProducerTypes.commercial:
					return `select id,description from commercial_vehicle_trees where commercialvehicleid=${modificationId} and parentid = ${parentId}`;

				case ECarProducerTypes.motorbike:
					return `select id,description from motorbike_trees where motorbikeid=${modificationId} and parentid = ${parentId}`;

				case ECarProducerTypes.engine:
					return `select id,description from engine_trees where engineid=${modificationId} and parentid = ${parentId}`;

				case ECarProducerTypes.axle:
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
				case ECarProducerTypes.passenger:
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

				case ECarProducerTypes.commercial:
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

				case ECarProducerTypes.motorbike:
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

				case ECarProducerTypes.engine:
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

				case ECarProducerTypes.axle:
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

	public async getAutoCompleteByOem(
		args: IAGETAutocompleteByOem
	): Promise<any> {
		let isBrand = true;
		const articleLinks: IArticleLinks[] = await this.manager.query(
			`select * from article_links where datasupplierarticlenumber = '${args.oem}';`
		);
		if (!articleLinks.length) {
			isBrand = false;
			return {
				isBrand,
				originalOem: "aq iwereba originali oem",
				message: "This part is not original",
			};
		}
		const groupedByLinkageType = this.Helper.groupByLinkageType(
			articleLinks
		);
		const carProducerType: ECarProducerTypes = this.Helper.getCarProducerTypeFromGroupedArticleLinks(
			groupedByLinkageType
		);
		const typedArticleLinks = groupedByLinkageType[carProducerType];
		const modificationIds = typedArticleLinks.map(el => el.linkageid);
		const modifications = await this.getModificationsByIds({
			type: carProducerType,
			ids: modificationIds,
		});
		const groupedModifications = this.Helper.groupModificationsById(
			modifications
		);
		const models = await this.getModelsByModificationIds({
			type: carProducerType,
			ids: modificationIds,
		});
		return {
			modifications: groupedModifications,
			models: models,
			articleLinks: articleLinks,
			isBrand: isBrand,
		};
	}

	public async getModelsByModificationIds(args: {
		type: ECarProducerTypes;
		ids: number[];
	}): Promise<IRGETCarModels> {
		const getQuery = (type: ECarProducerTypes): string => {
			const query = `select distinct modelid id, description name, constructioninterval from`;
			switch (type) {
				case ECarProducerTypes.passenger:
					return `${query} passanger_cars where id in `;

				case ECarProducerTypes.commercial:
					return `${query} commercial_vehicles where id in `;

				case ECarProducerTypes.motorbike:
					return `${query} motorbikes where id in `;

				case ECarProducerTypes.engine:
					return `${query} engines where id in `;

				case ECarProducerTypes.axle:
					return `${query} axles where id in `;
			}
		};

		const { ids, type } = args;

		let query = getQuery(type);

		query += this.Helper.arrayToSqlQueryList(ids);
		return this.manager.query(query);
	}

	public async getModificationsByIds(args: {
		type: ECarProducerTypes;
		ids: number[];
	}): Promise<ICarModificationsQueryData[]> {
		const { type, ids } = args;
		let query: string;
		switch (type) {
			case ECarProducerTypes.passenger:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype,
				a.displaytitle, a.displayvalue FROM passanger_cars pc
				LEFT JOIN passanger_car_attributes a on pc.id = a.passangercarid
				WHERE canbedisplayed = 'True'
				AND ispassengercar = 'True'`;
				break;
			case ECarProducerTypes.commercial:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM commercial_vehicles cv
				LEFT JOIN commercial_vehicle_attributes a on cv.id = a.commercialvehicleid
				WHERE canbedisplayed = 'True'
				AND iscommercialvehicle = 'True'`;
				break;
			case ECarProducerTypes.motorbike:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM motorbikes m
				LEFT JOIN motorbike_attributes a on m.id = a.motorbikeid
				WHERE canbedisplayed = 'True'
				AND ismotorbike = 'True'`;
				break;
			case ECarProducerTypes.engine:
				query = `SELECT id, fulldescription name, salesDescription, a.attributegroup,
				a.attributetype, a.displaytitle, a.displayvalue FROM engines e
				LEFT JOIN engine_attributes a on e.id= a.engineid
				WHERE canbedisplayed = 'True'
				AND isengine = 'True'`;
				break;
			case ECarProducerTypes.axle:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM axles ax
				LEFT JOIN axle_attributes a on ax.id= a.axleid
				WHERE canbedisplayed = 'True'
				AND isaxle = 'True'`;
				break;
		}
		query += "AND id in " + this.Helper.arrayToSqlQueryList(ids);

		return this.manager.query(query);
	}
}
