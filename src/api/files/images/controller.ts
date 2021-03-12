import {
	Controller,
	Param,
	Res,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../../../core/utils/uploads";
import * as fs from "fs";
import { join } from "path";
import {
	IRPOSTImage,
	IRPOSTManyImage,
} from "../../../../schemas/file/images/validators";
import { MError } from "../../../core/utils/errors";
import {
	Get,
	Post,
} from "../../../core/utils/decorators/custom-requests/request-mapping";

const controller = "api/files/image";

@Controller("/")
export class ImageController {
	@Post(controller)
	@UseInterceptors(
		FileInterceptor("image", {
			storage: diskStorage({
				destination: "./uploads",
				filename: editFileName,
			}),
			fileFilter: imageFileFilter,
		})
	)
	async uploadedFile(@UploadedFile() file): Promise<IRPOSTImage> {
		return {
			message: "Image uploaded successfully!",
			filename: file.filename,
		};
	}

	@Post(`${controller}/many`)
	@UseInterceptors(
		FilesInterceptor("images", 10, {
			storage: diskStorage({
				destination: "./uploads",
				filename: editFileName,
			}),
			fileFilter: imageFileFilter,
		})
	)
	async uploadMultipleFiles(
		@UploadedFiles() files
	): Promise<IRPOSTManyImage> {
		const response = [];
		files.forEach(file => {
			const fileResponse = {
				filename: file.filename,
			};
			response.push(fileResponse);
		});
		return {
			message: "Images uploaded successfully!",
			data: response,
		};
	}

	@Get(`${controller}/:imageName`)
	async getImage(@Param("imageName") image, @Res() res) {
		const root = "./uploads";
		const exist = fs.existsSync(join(root, image));
		if (!exist) throw new MError(404, "image not found");
		res.sendFile(image, { root });
	}
}
