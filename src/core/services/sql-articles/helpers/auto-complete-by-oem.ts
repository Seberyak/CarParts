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
	description: string;
}[];

interface INormalizedProducts {
	productId: number;
	description: string;
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
		prd.id productId ,prd.description  from article_oe a
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
		prd.id productId, prd.description from article_links al
		join suppliers s on al.supplierid=s.id
		join ${prd} prd on prd.id = al.productid
		where al.datasupplierarticlenumber = '${this.oem}' and 
		al.linkagetypeid=${ELinkageTypes[this.carManufacturerType]};`;
	}

	public normalizeTableResponse(data: IProductsTable): INormalizedProducts {
		const modificationIds = [...new Set(data.map(el => el.modificationId))];
		const supplierIds = [...new Set<number>(data.map(el => el.supplierId))];
		const suppliers: { id: number; name: string }[] = supplierIds.map(
			id => {
				const res = data.find(el => el.supplierId === id);
				return { name: res.supplier, id: res.supplierId };
			}
		);
		//TODO check this...
		const { productId, description } = data[0];
		return { modificationIds, suppliers, productId, description };
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
