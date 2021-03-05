import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { IPartModel, Part } from "../../models/typegoose/parts";
import { PartTags } from "../parts/helpers/tags";
import { docToObj } from "../../utils/db-config";
import { Connection } from "typeorm";

@Injectable()
export class MigrationsService {
	constructor(
		@InjectModel(Part)
		private readonly _PartModel: IPartModel,
		private readonly _Connection: Connection
	) {}
	public async startMigrations(): Promise<void> {
		const migrations: PromiseLike<any>[] = [this.partTagsMigrations()];
		console.log("================Migrations started================");
		await Promise.all(migrations);
		console.log("================Migrations executed================");
	}
	// some delay
	private async partTagsMigrations(): Promise<void> {
		//find all parts where modificationIds.size>0
		const parts = await this._PartModel.find({
			$nor: [
				{ modificationIds: { $exists: false } },
				{ modificationIds: { $size: 0 } },
			],
		});

		for (const part of parts) {
			const partArgs = docToObj(part);
			partArgs.tags = [];
			part.tags = await new PartTags(partArgs, this._Connection).get();
			part.markModified("tags");
			await part.save();
		}
		console.log(
			"================Part Tags Migration Executed================"
		);
	}
}
