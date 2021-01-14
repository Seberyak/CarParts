import { Injectable } from "@nestjs/common";
import { Part, IPartModel } from "../../models/typegoose/parts";
import { InjectModel } from "nestjs-typegoose";
import {
	IADELETEPart,
	IAGETManyPart,
	IAGETPart,
	IAPOSTPart,
	IAPUTPart,
	IRDELETEPart,
	IRGETManyPart,
	IRGETPart,
	IRPOSTPart,
	IRPUTPart,
} from "../../../../schemas/parts/validators";
import { assertResourceExist } from "../../utils/asserts";

@Injectable()
export class PartsService {
	constructor(
		@InjectModel(Part)
		private readonly _PartModel: IPartModel
	) {}

	public async create(args: IAPOSTPart): Promise<IRPOSTPart> {
		const part = new this._PartModel(args);
		return part.save();
	}

	public async get(args: IAGETPart): Promise<IRGETPart> {
		const part = await this._PartModel.findOne(args);
		assertResourceExist(part, "part");
		return part;
	}

	public async getMany(args: IAGETManyPart): Promise<IRGETManyPart> {
		return this._PartModel.getManyDocs(args);
	}

	public async update(args: IAPUTPart): Promise<IRPUTPart> {
		const { _id, ...updateData } = args;
		const updatedPart = this._PartModel.findOneAndUpdate(_id, updateData, {
			new: true,
		});
		assertResourceExist(updatedPart, "part");
		return updatedPart;
	}

	public async delete(args: IADELETEPart): Promise<IRDELETEPart> {
		return this._PartModel.deleteOne(args);
	}
}
