import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MongoGridFS } from "mongo-gridfs";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { IFile } from "../../../../schemas/file/helper-schemas";
import { GridFSBucketReadStream } from "mongodb";
import { MError } from "../../utils/errors";

@Injectable()
export class FilesService {
	private fileModel: MongoGridFS;

	constructor(@InjectConnection() private readonly connection: Connection) {
		this.fileModel = new MongoGridFS(this.connection.db, "fs");
	}

	async readStream(id: string): Promise<GridFSBucketReadStream> {
		return await this.fileModel.readFileStream(id);
	}

	async findInfo(id: string): Promise<IFile> {
		const result = await this.fileModel.findById(id).catch(err => {
			throw new MError(404, "File not found");
		});

		return {
			filename: result.filename,
			length: result.length,
			chunkSize: result.chunkSize,
			md5: result.md5,
			contentType: result.contentType,
		};
	}

	async deleteFile(id: string): Promise<boolean> {
		return await this.fileModel.delete(id).catch(err => {
			throw new MError(417, "An error occurred during file deletion");
		});
	}
}
