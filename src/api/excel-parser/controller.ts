import { Controller, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Post } from "../../core/utils/decorators/custom-requests/request-mapping";
import { FileInterceptor } from "@nestjs/platform-express";
import { excelFileFilter } from "../../core/utils/uploads";
import { diskStorage } from "multer";
import { extname } from "path";
import { ExcelParserService } from "../../core/services/excel-parser";
import {
	APOPSTExcelParserSchema,
	IAPOPSTExcelParser,
} from "../../../schemas/excel-parser/validators";
import { wValidatedArg } from "../../core/utils/decorators/validation";
///

const controller = "api/excel-parser";

@Controller(`/`)
export class ExcelParserController {
	// eslint-disable-next-line no-unused-vars
	constructor(private readonly _ExcelParserService: ExcelParserService) {}

	@Post(controller)
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./uploads/excel-files",
				filename(req, file, callback) {
					callback(null, `data${extname(file.originalname)}`);
				},
			}),
			fileFilter: excelFileFilter,
		})
	)
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@wValidatedArg(APOPSTExcelParserSchema) args: IAPOPSTExcelParser
	): Promise<any> {
		return this._ExcelParserService.main({
			type: args.type,
			fileName: file.filename,
		});
	}
}
