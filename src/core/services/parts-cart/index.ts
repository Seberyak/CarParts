import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { IPartCartModel, PartCart } from "../../models/typegoose/part-cart";
import {
	IADELETEPartCart,
	IAGETPartsCart,
	IAPOSTPartCart,
	IRDELETEPartCart,
	IRGETPartsCart,
	IRPOSTPartCart,
} from "../../../../schemas/parts-cart/validators";
import { getManyDocsFunc } from "../../models/typegoose/abstract";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { IPartCart } from "../../../../schemas/parts-cart/helper-schemas";
import { toInsertKeys } from "../../../../schemas/helper-schemas";
import { MError } from "../../utils/errors";
import { docToObj } from "../../utils/db-config";
import {
	assertResourceExist,
	assertUserHasPermission,
} from "../../utils/asserts";
import { PartsService } from "../parts";

@Injectable()
export class PartsCartService {
	constructor(
		@InjectModel(PartCart)
		private readonly _PartCartModel: IPartCartModel,
		private readonly _PartsService: PartsService
	) {}

	public async getPartsFromCart(
		args: IAGETPartsCart,
		user: IUser
	): Promise<IRGETPartsCart> {
		return getManyDocsFunc(args, this._PartCartModel, { author: user._id });
	}

	public async postPartToCart(
		args: IAPOSTPartCart,
		user: IUser
	): Promise<IRPOSTPartCart> {
		// check if part is unique for user's cart and part exist
		const [part, partInUserCart] = await Promise.all([
			this._PartsService.get({ _id: args.partId }),
			this._PartCartModel.findOne({
				author: user._id,
				partId: args.partId,
			}),
		]);
		assertResourceExist(part, "part");
		if (!!partInUserCart) {
			throw new MError(
				HttpStatus.FORBIDDEN,
				"part already exist in your cart"
			);
		}

		const dataToSave: Omit<IPartCart, toInsertKeys> = {
			author: user._id,
			partId: args.partId,
		};

		const partCart = new this._PartCartModel(dataToSave);
		return partCart.save().then(docToObj);
	}

	public async deletePartFromCart(
		args: IADELETEPartCart,
		user: IUser
	): Promise<IRDELETEPartCart> {
		const partFromCart = await this._PartCartModel
			.findById(args._id)
			.then(doc => docToObj(doc));
		assertResourceExist(partFromCart, "part");
		assertUserHasPermission(user, partFromCart);
		await this._PartCartModel.deleteOne(args);
	}
}
