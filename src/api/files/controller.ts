import {
	Post,
	Controller,
	UploadedFiles,
	UseInterceptors,
	Get,
	HttpStatus,
	Res,
	Delete,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import { ApiConsumes } from "@nestjs/swagger";
import { FilesService } from "../../core/services/files";
import { IFileInfo } from "../../../schemas/file/helper-schemas";
import { MError } from "../../core/utils/errors";
import {
	ADELETEFileSchema,
	AGETDownloadFileSchema,
	AGETFileInfoSchema,
	AGETRawFileSchema,
	IADELETEFile,
	IAGETDownloadFile,
	IAGETFileInfo,
	IAGETRawFile,
	IRGETDownloadFile,
	IRGETRawFile,
	IRPOSTFile,
} from "../../../schemas/file/validators";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import { ObjectIdPattern } from "../../core/utils/common";

// @ApiUseTags("Attachments")
@Controller("api/files/")
export class FilesController {
	constructor(private filesService: FilesService) {}

	@Post("/upload")
	@ApiConsumes("multipart/form-data")
	@ApiImplicitFile({
		name: "file",
		required: true,
		description: "Attachment Files",
	})
	@UseInterceptors(FilesInterceptor("file"))
	async upload(@UploadedFiles() files: any): Promise<IRPOSTFile> {
		const response = [];
		files.forEach(file => {
			const fileResponse = {
				originalname: file.originalname,
				encoding: file.encoding,
				mimetype: file.mimetype,
				id: file.id,
				filename: file.filename,
				metadata: file.metadata,
				bucketName: file.bucketName,
				chunkSize: file.chunkSize,
				size: file.size,
				md5: file.md5,
				uploadDate: file.uploadDate,
				contentType: file.contentType,
			};
			response.push(fileResponse);
		});
		return response;
	}

	@Get(`info/:_id(${ObjectIdPattern})`)
	async getFileInfo(
		@wValidatedArg(AGETFileInfoSchema) args: IAGETFileInfo
	): Promise<IFileInfo> {
		const id = args._id.toString();
		const file = await this.filesService.findInfo(id);
		const filestream = await this.filesService.readStream(id);
		if (!filestream) {
			throw new MError(
				417,
				"An error occurred while retrieving file info"
			);
		}
		return {
			message: "File has been detected",
			file: file,
		};
	}

	@Get(`/:_id(${ObjectIdPattern})`)
	async getFile(
		@wValidatedArg(AGETRawFileSchema) args: IAGETRawFile,
		@Res() res: any
	): Promise<IRGETRawFile> {
		const id = args._id.toHexString();
		const file = await this.filesService.findInfo(id);
		const filestream = await this.filesService.readStream(id);
		if (!filestream) {
			throw new MError(417, "An error occurred while retrieving file");
		}
		res.header("Content-Type", file.contentType);
		return filestream.pipe(res);
	}

	@Get(`download/:_id(${ObjectIdPattern})`)
	async downloadFile(
		@wValidatedArg(AGETDownloadFileSchema) args: IAGETDownloadFile,
		@Res() res: any
	): Promise<IRGETDownloadFile> {
		const id = args._id.toHexString();
		const file = await this.filesService.findInfo(id);
		const filestream = await this.filesService.readStream(id);
		if (!filestream) {
			throw new MError(
				HttpStatus.EXPECTATION_FAILED,
				"An error occurred while retrieving file"
			);
		}
		res.header("Content-Type", file.contentType);
		res.header(
			"Content-Disposition",
			"attachment; filename=" + file.filename
		);
		return filestream.pipe(res);
	}

	@Delete(":_id")
	async deleteFile(
		@wValidatedArg(ADELETEFileSchema) args: IADELETEFile
	): Promise<IFileInfo> {
		const id = args._id.toHexString();
		const file = await this.filesService.findInfo(id);
		await this.filesService.deleteFile(id);

		return {
			message: "File has been deleted",
			file: file,
		};
	}
}
