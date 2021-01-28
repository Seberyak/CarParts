import { Controller } from "@nestjs/common";
import { Get } from "../../core/utils/decorators/custom-requests/request-mapping";
import { SqlArticlesService } from "../../core/services/sql-articles";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import {
	AGETAutocompleteByOemSchema,
	AGETCarModelsSchema,
	AGETCarModificationsSchema,
	AGETCarProducersSchema,
	AGETPartCategoriesSchema,
	AGETSectionPartsSchema,
	IAGETAutocompleteByOem,
	IAGETCarModels,
	IAGETCarModifications,
	IAGETCarProducers,
	IAGETPartCategories,
	IAGETSectionParts,
	IRGETCarModels,
	IRGETCarModifications,
	IRGETCarProducers,
	IRGETPartCategories,
	IRGETSectionParts,
} from "../../../schemas/sql-articles/validators";

const controller = "api/sql-articles";

@Controller("/")
export class SqlArticlesController {
	constructor(private readonly _SqlArticlesService: SqlArticlesService) {}

	@Get(`${controller}/car-producers`)
	async getCarProducers(
		@wValidatedArg(AGETCarProducersSchema) args: IAGETCarProducers
	): Promise<IRGETCarProducers> {
		return this._SqlArticlesService.getCarProducers(args);
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

	@Get(`${controller}/parts-by-section`)
	async getPartsBySection(
		@wValidatedArg(AGETSectionPartsSchema) args: IAGETSectionParts
	): Promise<IRGETSectionParts> {
		return this._SqlArticlesService.getPartsBySection(args);
	}
	@Get(`${controller}/autocomplete-by-oem`)
	async getAutoCompleteByOem(
		@wValidatedArg(AGETAutocompleteByOemSchema)
		args: IAGETAutocompleteByOem
	): Promise<any> {
		return this._SqlArticlesService.getAutoCompleteByOem(args);
	}
}
