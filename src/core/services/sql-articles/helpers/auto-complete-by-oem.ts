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

	public getOriginalsQuery(): string {
		const prd = this.getPrdTable();

		return `select distinct s.description supplier,s.id supplierId, al.linkageid modificationId,
		prd.id productId ,prd.description  title from article_oe a
		join suppliers s on a.supplierid=s.id
		join article_links al on al.datasupplierarticlenumber=a.datasupplierarticlenumber
		and al.supplierid=a.supplierid
		join ${prd} prd on al.productid = prd.id
		where a.OENbr = '${this.oem}' and 
		al.linkagetypeid=${ELinkageTypes[this.carManufacturerType]};`;
	}

	public getNonOriginalsQuery(): string {
		const prd = this.getPrdTable();

		return `select distinct s.description supplier,s.id supplierId,al.linkageid modificationId,
		prd.id productId, prd.description title from article_links al
		join suppliers s on al.supplierid=s.id
		join ${prd} prd on prd.id = al.productid
		where al.datasupplierarticlenumber = '${this.oem}' and 
		al.linkagetypeid=${ELinkageTypes[this.carManufacturerType]};`;
	}

	public normalizeTableResponse(data: IProductsTable): INormalizedProducts {
		const groupByProductId = (args: IProductsTable) => {
			let res: Record<number, INormalizedProducts>;
			args.forEach(el => {
				if (!res.hasOwnProperty(el.productId)) {
					res[el.productId] = {
						suppliers: [],
						modificationIds: [],
						productId: el.productId,
						title: el.title,
					};
				}
				res[el.productId].modificationIds.push(el.modificationId);
				res[el.productId].suppliers.push({
					id: el.supplierId,
					name: el.supplier,
				});
			});
		};

		const modificationIds = [...new Set(data.map(el => el.modificationId))];
		const supplierIds = [...new Set<number>(data.map(el => el.supplierId))];
		const suppliers: { id: number; name: string }[] = supplierIds.map(
			id => {
				const res = data.find(el => el.supplierId === id);
				return { name: res.supplier, id: res.supplierId };
			}
		);
		//TODO check this...
		const { productId, title } = data[0];
		const productIdsSet = new Set(data.map(el => el.productId));
		console.log(...productIdsSet);
		return { modificationIds, suppliers, productId, title };
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
