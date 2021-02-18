import { IAGETAutocompleteByOem } from "../../../../../schemas/sql-articles/validators";
import {
	ECarManufacturerTypes,
	ELinkageTypes,
} from "../../../../../schemas/sql-articles/helper-schemas";

type IProductsTable = {
	supplier: string;
	modificationId: number;
	supplierId: number;
	productId: number;
	title: string;
}[];

interface INormalizedProducts {
	productId: number;
	title: string;
	suppliers: { id: number; name: string }[];
	modificationIds: number[];
}

export class AutoCompleteByOem {
	private readonly oem: string;
	private readonly carManufacturerType: ECarManufacturerTypes;

	constructor(args: IAGETAutocompleteByOem) {
		this.oem = args.oem;
		this.carManufacturerType = args.type;
	}

	public getOriginalsQuery(productId?: number): string {
		const prd = this.getPrdTable();
		const productIdCondition = productId ? ` and prd.id=${productId}` : "";
		return `select distinct s.description supplier,s.id supplierId, al.linkageid modificationId,
		prd.id productId ,prd.description  title from article_oe a
		join suppliers s on a.supplierid=s.id
		join article_links al on al.datasupplierarticlenumber=a.datasupplierarticlenumber
		and al.supplierid=a.supplierid
		join ${prd} prd on al.productid = prd.id
		where a.OENbr = '${this.oem}' and 
		al.linkagetypeid=${
			ELinkageTypes[this.carManufacturerType]
		} ${productIdCondition};`;
	}

	public getNonOriginalsQuery(productId?: number): string {
		const prd = this.getPrdTable();
		const productIdCondition = productId ? ` and prd.id=${productId}` : "";
		return `select distinct s.description supplier,s.id supplierId,al.linkageid modificationId,
		prd.id productId, prd.description title from article_links al
		join suppliers s on al.supplierid=s.id
		join ${prd} prd on prd.id = al.productid
		where al.datasupplierarticlenumber = '${this.oem}' and 
		al.linkagetypeid=${
			ELinkageTypes[this.carManufacturerType]
		} ${productIdCondition};`;
	}

	public normalizeTableResponse(data: IProductsTable): INormalizedProducts[] {
		const groupByProductId = (
			args: IProductsTable
		): Record<
			number,
			INormalizedProducts & {
				modificationIdsSet: Set<number>;
				supplierIdsSet: Set<number>;
			}
		> => {
			const groupedByProductIdObj: Record<
				number,
				INormalizedProducts & {
					modificationIdsSet: Set<number>;
					supplierIdsSet: Set<number>;
				}
			> = {};
			args.forEach(el => {
				if (!groupedByProductIdObj.hasOwnProperty(el.productId)) {
					groupedByProductIdObj[el.productId] = {
						suppliers: [],
						modificationIds: [],
						productId: el.productId,
						title: el.title,
						modificationIdsSet: new Set<number>(),
						supplierIdsSet: new Set<number>(),
					};
				}

				groupedByProductIdObj[el.productId].modificationIdsSet.add(
					el.modificationId
				);
				if (
					!groupedByProductIdObj[el.productId].supplierIdsSet.has(
						el.supplierId
					)
				) {
					groupedByProductIdObj[el.productId].supplierIdsSet.add(
						el.supplierId
					);
					groupedByProductIdObj[el.productId].suppliers.push({
						id: el.supplierId,
						name: el.supplier,
					});
				}
			});
			return groupedByProductIdObj;
		};

		const groupedByProductIdObj = groupByProductId(data);
		const groupedByProductIdArr: INormalizedProducts[] = [];
		for (const key in groupedByProductIdObj) {
			if (groupedByProductIdObj.hasOwnProperty(key)) {
				const element = groupedByProductIdObj[key];
				groupedByProductIdArr.push({
					productId: element.productId,
					suppliers: element.suppliers,
					title: element.title,
					modificationIds: [...element.modificationIdsSet],
				});
			}
		}
		return groupedByProductIdArr;
	}

	private getPrdTable(): string {
		switch (this.carManufacturerType) {
			case ECarManufacturerTypes.passenger:
				return "passanger_car_prd";

			case ECarManufacturerTypes.motorbike:
				return "motorbike_prd";

			case ECarManufacturerTypes.engine:
				return "engine_prd";

			case ECarManufacturerTypes.commercial:
				return "commercial_vehicle_prd";

			case ECarManufacturerTypes.axle:
				return "axle_prd";
		}
	}
}
