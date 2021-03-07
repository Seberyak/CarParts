import { Controller } from "@nestjs/common";
import {
	Delete,
	Get,
	Post,
} from "../../core/utils/decorators/custom-requests/request-mapping";
import { PartsCartService } from "../../core/services/parts-cart";
import { wUser, wValidatedArg } from "../../core/utils/decorators/validation";
import {
	ADELETEPartCartSchema,
	AGETPartsCartSchema,
	APOSTPartCartSchema,
	IADELETEPartCart,
	IAGETPartsCart,
	IAPOSTPartCart,
	IRDELETEPartCart,
	IRGETPartsCart,
	IRPOSTPartCart,
} from "../../../schemas/parts-cart/validators";
import { IUser } from "../../../schemas/user/helper-schemas";

const controller = "api/parts-cart";

@Controller("/")
export class PartsCartController {
	constructor(private readonly _PartsCartService: PartsCartService) {}

	@Get(`${controller}/`)
	public async getPartsFromCart(
		@wValidatedArg(AGETPartsCartSchema) args: IAGETPartsCart,
		@wUser() user: IUser
	): Promise<IRGETPartsCart> {
		return this._PartsCartService.getPartsFromCart(args, user);
	}

	@Post(`${controller}/`)
	public async postPartToCart(
		@wValidatedArg(APOSTPartCartSchema) args: IAPOSTPartCart,
		@wUser() user: IUser
	): Promise<IRPOSTPartCart> {
		return this._PartsCartService.postPartToCart(args, user);
	}

	@Delete(`${controller}/:_id`)
	public async deletePartFromCart(
		@wValidatedArg(ADELETEPartCartSchema) args: IADELETEPartCart,
		@wUser() user: IUser
	): Promise<IRDELETEPartCart> {
		return this._PartsCartService.deletePartFromCart(args, user);
	}
}
