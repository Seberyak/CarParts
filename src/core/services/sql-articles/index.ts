/* eslint-disable max-lines */
import { Injectable } from "@nestjs/common";
import { Connection, EntityManager } from "typeorm";
import {
	IAGETAutocompleteByOem,
	IAGETCarManufacturers,
	IAGETCarModels,
	IAGETCarModifications,
	IAGETPartCategories,
	IAGETPartsByProductId,
	IAGETProductsByNode,
	ICarModificationsQueryData,
	IRGETCarManufacturers,
	IRGETCarModels,
	IRGETCarModifications,
	IRGETPartCategories,
	IRGETPartsByProductId,
	IRGETProductsByNode,
} from "../../../../schemas/sql-articles/validators";
import { ECarManufacturerTypes } from "../../../../schemas/sql-articles/helper-schemas";
import { SqlArticlesHelper } from "./helpers";
import { assertResourceExist } from "../../utils/asserts";
import { AutoCompleteByOem } from "./helpers/auto-complete-by-oem";

type IProductsTable = {
	supplier: string;
	modificationId: number;
	supplierId: number;
	productId: number;
	title: string;
}[];

@Injectable()
export class SqlArticlesService {
	private readonly manager: EntityManager;
	private Helper;

	constructor(private readonly _Connection: Connection) {
		this.manager = this._Connection.manager;
		this.Helper = new SqlArticlesHelper(this.manager);
	}

	public getCarManufacturers(
		args: IAGETCarManufacturers
	): Promise<IRGETCarManufacturers> {
		const { type } = args;
		const where = this.Helper.getWhereConditionByType(type);
		const order = type === "motorbike" ? "description" : "matchcode";
		const query = `SELECT id, description name FROM manufacturers 
		WHERE canbedisplayed = 'True' ${where} ORDER BY ${order}`;
		return this.manager.query(query);
	}

	public async getCarModels(args: IAGETCarModels): Promise<IRGETCarModels> {
		const { manufacturerId, type, pattern, productionYear } = args;
		let where = this.Helper.getWhereConditionByType(type);
		if (!!pattern) where += `AND description LIKE '${pattern} %'`;

		const query = `SELECT id, description name, constructioninterval
		FROM models
		WHERE canbedisplayed = 'True'
		AND manufacturerid = ${manufacturerId} ${where} ORDER BY description`;

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
			case ECarManufacturerTypes.passenger:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype,
				a.displaytitle, a.displayvalue FROM passanger_cars pc
				LEFT JOIN passanger_car_attributes a on pc.id = a.passangercarid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND ispassengercar = 'True'`;
				break;
			case ECarManufacturerTypes.commercial:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM commercial_vehicles cv
				LEFT JOIN commercial_vehicle_attributes a on cv.id = a.commercialvehicleid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND iscommercialvehicle = 'True'`;
				break;
			case ECarManufacturerTypes.motorbike:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM motorbikes m
				LEFT JOIN motorbike_attributes a on m.id = a.motorbikeid
				WHERE canbedisplayed = 'True'
				AND modelid = ${modelId} AND ismotorbike = 'True'`;
				break;
			case ECarManufacturerTypes.engine:
				query = `SELECT id, fulldescription name, salesDescription, a.attributegroup,
				a.attributetype, a.displaytitle, a.displayvalue FROM engines e
				LEFT JOIN engine_attributes a on e.id= a.engineid
				WHERE canbedisplayed = 'True'
				AND manufacturerId = ${modelId} AND isengine = 'True'`;
				break;
			case ECarManufacturerTypes.axle:
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
				case ECarManufacturerTypes.passenger:
					return `select distinct id,description from passanger_car_trees where passangercarid=${modificationId} and parentid = ${parentId}`;

				case ECarManufacturerTypes.commercial:
					return `select distinct id,description from commercial_vehicle_trees where commercialvehicleid=${modificationId} and parentid = ${parentId}`;

				case ECarManufacturerTypes.motorbike:
					return `select distinct id,description from motorbike_trees where motorbikeid=${modificationId} and parentid = ${parentId}`;

				case ECarManufacturerTypes.engine:
					return `select distinct id,description from engine_trees where engineid=${modificationId} and parentid = ${parentId}`;

				case ECarManufacturerTypes.axle:
					return `select distinct id,description from axle_trees where axleid=${modificationId} and parentid = ${parentId}`;
			}
		};
		const query = getQuery(args);
		return this.manager.query(query);
	}

	// eslint-disable-next-line max-lines-per-function
	public async getPartsByProductId(
		args: IAGETPartsByProductId
	): Promise<IRGETPartsByProductId> {
		const getQuery = (args1: IAGETPartsByProductId): string => {
			const { modificationId, productId, type } = args1;
			switch (type) {
				case ECarManufacturerTypes.passenger:
					return `SELECT distinct al.datasupplierarticlenumber partNumber,
				s.description supplierName, prd.description productName
				FROM article_links al
				JOIN passanger_car_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN passanger_car_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.passangercarid
				AND al.linkageid = ${modificationId}
				AND pds.productid = ${productId}
				AND al.linkagetypeid = 2
				ORDER BY s.description, al.datasupplierarticlenumber`;

				case ECarManufacturerTypes.commercial:
					return `SELECT distinct al.datasupplierarticlenumber partNumber,
				s.description supplierName, prd.description productName
				FROM article_links al
				JOIN commercial_vehicle_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN commercial_vehicle_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.commertialvehicleid
				AND al.linkageid = ${modificationId}
				AND pds.productid = ${productId}
				AND al.linkagetypeid = 16
				ORDER BY s.description, al.datasupplierarticlenumber`;

				case ECarManufacturerTypes.motorbike:
					return `SELECT distinct al.datasupplierarticlenumber partNumber,
				s.description supplierName, prd.description productName
				FROM article_links al
				JOIN motorbike_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN motorbike_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.motorbikeid
				AND al.linkageid = ${modificationId}
				AND pds.productid = ${productId}
				AND al.linkagetypeid = 777
				ORDER BY s.description, al.datasupplierarticlenumber`;

				case ECarManufacturerTypes.engine:
					return `SELECT distinct pds.engineid, al.datasupplierarticlenumber partNumber,
				prd.description productName, s.description supplierName
				FROM article_links al
				JOIN engine_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN engine_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.engineid
				AND al.linkageid = ${modificationId}
				AND pds.productid = ${productId}
				AND al.linkagetypeid = 14
				ORDER BY s.description, al.datasupplierarticlenumber`;

				case ECarManufacturerTypes.axle:
					return `SELECT distinct pds.axleid, al.datasupplierarticlenumber partNumber,
				prd.description productName, s.description supplierName
				FROM article_links al
				JOIN axle_pds pds on al.supplierid = pds.supplierid
				JOIN suppliers s on s.id = al.supplierid
				JOIN axle_prd prd on prd.id = al.productid
				WHERE al.productid = pds.productid
				AND al.linkageid = pds.axleid
				AND al.linkageid = ${modificationId}
				AND pds.productid = ${productId}
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
		const helper = new AutoCompleteByOem(args);

		const nonOriginalsQuery = helper.getNonOriginalsQuery();
		let res: IProductsTable = await this.manager.query(nonOriginalsQuery);
		if (!res.length) {
			const originalsQuery = helper.getOriginalsQuery();
			res = await this.manager.query(originalsQuery);
			if (!res.length) assertResourceExist(undefined, "part");
		}
		const productsTable = res;

		return helper.normalizeTableResponse(productsTable);

		/*
    const articleLinks: IArticleLinks[] = await this.manager.query(
      nonOriginalsQuery
    );
    if (!articleLinks.length) {
      assertResourceExist(undefined, "part");
      isBrand = false;
      return {
        isBrand,
        originalOem: "aq iwereba originali oem",
        message: "This part is not original",
      };
    }

    const modificationIds = articleLinks.map(el => el.linkageid);

    if (1 < 2) {
      return {
        modificationId:
          modificationIds[getRandomInt(modificationIds.length)],
        len: modificationIds.length,
      };
    }

    return await this.Helper.getCarsTreeByModificationIds(
      modificationIds,
      args.type
    );*/
	}

	// TODO add queries to engine type
	public async getModelsByModificationIds(args: {
		type: ECarManufacturerTypes;
		ids: number[];
	}): Promise<IRGETCarModels> {
		const getQuery = (type: ECarManufacturerTypes): string => {
			const query = `select distinct modelid id, description name, constructioninterval from`;
			switch (type) {
				case ECarManufacturerTypes.passenger:
					return `${query} passanger_cars where id in `;

				case ECarManufacturerTypes.commercial:
					return `${query} commercial_vehicles where id in `;

				case ECarManufacturerTypes.motorbike:
					return `${query} motorbikes where id in `;

				case ECarManufacturerTypes.engine:
					return `${query} engines where id in `;

				case ECarManufacturerTypes.axle:
					return `${query} axles where id in `;
			}
		};

		const { ids, type } = args;

		let query = getQuery(type);

		query += this.Helper.arrayToSqlQueryList(ids);
		return this.manager.query(query);
	}

	public async getModificationsByIds(args: {
		type: ECarManufacturerTypes;
		ids: number[];
	}): Promise<ICarModificationsQueryData[]> {
		const { type, ids } = args;
		let query: string;
		switch (type) {
			case ECarManufacturerTypes.passenger:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype,
				a.displaytitle, a.displayvalue FROM passanger_cars pc
				LEFT JOIN passanger_car_attributes a on pc.id = a.passangercarid
				WHERE canbedisplayed = 'True'
				AND ispassengercar = 'True'`;
				break;
			case ECarManufacturerTypes.commercial:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM commercial_vehicles cv
				LEFT JOIN commercial_vehicle_attributes a on cv.id = a.commercialvehicleid
				WHERE canbedisplayed = 'True'
				AND iscommercialvehicle = 'True'`;
				break;
			case ECarManufacturerTypes.motorbike:
				query = `SELECT id, fulldescription name, a.attributegroup, a.attributetype, a.displaytitle, a.displayvalue
				FROM motorbikes m
				LEFT JOIN motorbike_attributes a on m.id = a.motorbikeid
				WHERE canbedisplayed = 'True'
				AND ismotorbike = 'True'`;
				break;
			case ECarManufacturerTypes.engine:
				query = `SELECT id, fulldescription name, salesDescription, a.attributegroup,
				a.attributetype, a.displaytitle, a.displayvalue FROM engines e
				LEFT JOIN engine_attributes a on e.id= a.engineid
				WHERE canbedisplayed = 'True'
				AND isengine = 'True'`;
				break;
			case ECarManufacturerTypes.axle:
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

	public async getProductsByNode(
		args: IAGETProductsByNode
	): Promise<IRGETProductsByNode> {
		const { type, modificationId, nodeId } = args;

		const getTable = (
			type: ECarManufacturerTypes
		): {
			pds: string;
			prd: string;
			modificationColumn: string;
			tree: string;
		} => {
			switch (type) {
				case ECarManufacturerTypes.axle:
					return {
						pds: "axle_pds",
						prd: "axle_prd",
						modificationColumn: "axleid",
						tree: "axle_trees",
					};
				case ECarManufacturerTypes.commercial:
					return {
						pds: "commercial_vehicle_pds",
						prd: "commercial_vehicle_prd",
						modificationColumn: "commertialvehicleid",
						tree: "commercial_vehicle_trees",
					};
				case ECarManufacturerTypes.engine:
					return {
						pds: "engine_pds",
						prd: "engine_prd",
						modificationColumn: "engineid",
						tree: "engine_trees",
					};
				case ECarManufacturerTypes.motorbike:
					return {
						pds: "motorbike_pds",
						prd: "motorbike_prd",
						modificationColumn: "motorbikeid",
						tree: "motorbike_trees",
					};
				case ECarManufacturerTypes.passenger:
					return {
						pds: "passanger_car_pds",
						prd: "passanger_car_prd",
						modificationColumn: "passangercarid",
						tree: "passanger_car_trees",
					};
			}
		};

		const { modificationColumn, prd, pds, tree } = getTable(type);
		const query = `select distinct tree.id nodeId, prd.id productId, prd.description 
		from ${tree} tree
		join ${pds} pds on pds.nodeid = tree.id and pds.${modificationColumn} = tree.${modificationColumn}
		join ${prd} prd on pds.productid = prd.id
		where tree.${modificationColumn} = ${modificationId}
		and tree.id = ${nodeId}`;

		return this.manager.query(query);
	}
}
