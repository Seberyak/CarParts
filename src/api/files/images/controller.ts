import {
	Controller,
	Get,
	Param,
	Post,
	Res,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import {
	editFileName,
	imageFileFilter,
} from "../../../core/utils/image-upload";
import * as fs from "fs";
import { join } from "path";
import {
	IRPOSTImage,
	IRPOSTManyImage,
} from "../../../../schemas/file/images/validators";
import { MError } from "../../../core/utils/errors";

@Controller("api/files/image")
export class ImageController {
	@Post()
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

	@Post("/many")
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

	@Get(":imageName")
	async getImage(@Param("imageName") image, @Res() res) {
		const root = "./uploads";
		const exist = fs.existsSync(join(root, image));
		if (!exist) throw new MError(404, "image not found");
		res.sendFile(image, { root });
	}
}
