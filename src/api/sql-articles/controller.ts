import { Controller } from "@nestjs/common";
import { Get } from "../../core/utils/decorators/custom-requests/request-mapping";
import { SqlArticlesService } from "../../core/services/sql-articles";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import {
	AGETAutocompleteByOemSchema,
	AGETCarModelsSchema,
	AGETCarModificationsSchema,
	AGETCarManufacturersSchema,
	AGETPartCategoriesSchema,
	IAGETAutocompleteByOem,
	IAGETCarModels,
	IAGETCarModifications,
	IAGETCarManufacturers,
	IAGETPartCategories,
	IAGETPartsByProductId,
	IRGETCarModels,
	IRGETCarModifications,
	IRGETCarManufacturers,
	IRGETPartCategories,
	AGETProductsByNodeSchema,
	IAGETProductsByNode,
	IRGETProductsByNode,
	AGETPartsByProductIdSchema,
	IRGETPartsByProductId,
	IRGETAutocompleteByOem,
	IRGETCarTreesByModificationIds,
	IAGETCarTreesByModificationIds,
	AGETCarTreesByModificationIdsSchema,
} from "../../../schemas/sql-articles/validators";

const controller = "api/sql-articles";

@Controller("/")
export class SqlArticlesController {
	constructor(private readonly _SqlArticlesService: SqlArticlesService) {}

	@Get(`${controller}/car-manufacturers`)
	async getCarManufacturers(
		@wValidatedArg(AGETCarManufacturersSchema) args: IAGETCarManufacturers
	): Promise<IRGETCarManufacturers> {
		return this._SqlArticlesService.getCarManufacturers(args);
	}

	@Get(`${controller}/car-models`)
	async getCarModels(
		@wValidatedArg(AGETCarModelsSchema) args: IAGETCarModels
	): Promise<IRGETCarModels> {
		return this._SqlArticlesService.getCarModels(args);
	}

	@Get(`${controller}/car-modifications`)
	async getCarModifications(
		@wValidatedArg(AGETCarModificationsSchema) args: IAGETCarModifications
	): Promise<IRGETCarModifications> {
		return this._SqlArticlesService.getModifications(args);
	}

	@Get(`${controller}/part-categories`)
	async getPartCategories(
		@wValidatedArg(AGETPartCategoriesSchema) args: IAGETPartCategories
	): Promise<IRGETPartCategories> {
		return this._SqlArticlesService.getPartCategories(args);
	}

	@Get(`${controller}/parts-by-product-id`)
	async getPartsBySection(
		@wValidatedArg(AGETPartsByProductIdSchema) args: IAGETPartsByProductId
	): Promise<IRGETPartsByProductId> {
		return this._SqlArticlesService.getPartsByProductId(args);
	}
	@Get(`${controller}/autocomplete-by-oem`)
	async getAutoCompleteByOem(
		@wValidatedArg(AGETAutocompleteByOemSchema)
		args: IAGETAutocompleteByOem
	): Promise<IRGETAutocompleteByOem> {
		return this._SqlArticlesService.getAutoCompleteByOem(args);
	}

	@Get(`${controller}/products-by-node`)
	async getProductsByNode(
		@wValidatedArg(AGETProductsByNodeSchema) args: IAGETProductsByNode
	): Promise<IRGETProductsByNode> {
		return this._SqlArticlesService.getProductsByNode(args);
	}

	@Get(`${controller}/car-trees-by-modificationIds`)
	async getCarTreesBtModificationIds(
		@wValidatedArg(AGETCarTreesByModificationIdsSchema)
		args: IAGETCarTreesByModificationIds
	): Promise<IRGETCarTreesByModificationIds> {
		return this._SqlArticlesService.getCarTreesBtModificationIds(args);
	}
}
