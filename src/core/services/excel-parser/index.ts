import { HttpStatus, Injectable } from "@nestjs/common";
import { join } from "path";
import * as spawn from "await-spawn";
import * as fs from "fs";
import { MError } from "../../utils/errors";
import * as rimraf from "rimraf";
import {
	IParsedDataFromExcel,
	IRPOPSTExcelParser,
} from "../../../../schemas/excel-parser/validators";
import { SqlArticlesService } from "../sql-articles";
import { ECarManufacturerTypes } from "../../../../schemas/sql-articles/helper-schemas";
import { IRGETAutocompleteByOem } from "../../../../schemas/sql-articles/validators";
import { IAPOSTPart } from "../../../../schemas/parts/validators";
import { PartsService } from "../parts";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { ObjectId } from "bson";
// const FormData = require("form-data");
import * as FormData from "form-data";
import axios from "axios";
///
const rootDir = join(__dirname, "../../../../../");

interface IRAutoCompleteByManyOem {
	completed: (IRGETAutocompleteByOem[number] & { oem: string })[];
	uncompleted: {
		notExist: string[];
		hasManyProductId: string[];
	};
}

interface IAPrepareDataForUpload {
	autoCompleted: IRAutoCompleteByManyOem["completed"];
	parsed: IParsedDataFromExcel[];
	carManufacturerType: ECarManufacturerTypes;
	images: Record<string, IRUploadImage>;
}
type IRPrepareDataForUpload = IAPOSTPart[];

interface IAUploadImage {
	imageName: string;
	url: string;
	imagesPath: string;
}

interface IRUploadImage {
	imageName: string;
	status: HttpStatus;
	uploadedName?: string;
}

interface IRUploadManyImage {
	completed: Record<string, IRUploadImage>;
	uncompleted: IRUploadImage[];
}

@Injectable()
export class ExcelParserService {
	constructor(
		private readonly _SqlArticlesService: SqlArticlesService,
		private readonly _PartsService: PartsService
	) {}

	public async main(args: {
		carManufacturerType: ECarManufacturerTypes;
		fileName: string;
	}) {
		//parse data
		const parsedParts = await this.parse(args.fileName);

		//upload images
		const images = await this.uploadManyImage(
			parsedParts.map(el => el.imageName)
		);

		//delete temporary data after parse
		this.actionAfterParse(args.fileName);

		const oems = parsedParts.map(el => el.oem).slice(0, 25);

		const { completed, uncompleted } = await this.autoCompleteByManyOem({
			type: args.carManufacturerType,
			oems: oems,
		});

		const partsForUpload = this.preparePartsForUpload({
			autoCompleted: completed,
			parsed: parsedParts,
			carManufacturerType: args.carManufacturerType,
			images: images.completed,
		});
		const uploadedParts = await this.uploadParts(partsForUpload);
		return { uploaded: uploadedParts, uncompleted };
	}

	private async uploadManyImage(
		imageNames: string[]
	): Promise<IRUploadManyImage> {
		const imagesPath = join(
			rootDir,
			"uploads",
			"excel-files",
			"parsed",
			"images"
		);
		const postPromises: PromiseLike<IRUploadImage>[] = [];

		const url = `https://localhost:${process.env.API_PORT}/api/files/image`;

		imageNames.forEach(imageName =>
			postPromises.push(this.uploadImage({ imageName, url, imagesPath }))
		);

		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		const res = await Promise.all(postPromises);
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

		const images: {
			completed: IRUploadImage[];
			uncompleted: IRUploadImage[];
		} = {
			completed: res.filter(el => el.status === HttpStatus.CREATED),
			uncompleted: res.filter(el => el.status !== HttpStatus.CREATED),
		};
		const completedObj: Record<string, IRUploadImage> = {};
		images.completed.forEach(image => {
			completedObj[image.imageName] = image;
		});
		return { completed: completedObj, uncompleted: images.uncompleted };
	}

	private async uploadImage(args: IAUploadImage): Promise<IRUploadImage> {
		const { url, imagesPath, imageName } = args;
		const imageForPostPath = join(imagesPath, imageName);

		const form = new FormData();
		form.append("image", fs.createReadStream(imageForPostPath));

		const request_config = {
			headers: {
				...form.getHeaders(),
			},
		};

		return axios
			.post(url, form, request_config)
			.then(res => ({
				imageName,
				status: res.status,
				uploadedName: res.data.filename,
			}))
			.catch(err => ({ imageName, status: HttpStatus.FORBIDDEN }));
	}

	private async uploadParts(parts: IAPOSTPart[]): Promise<any[]> {
		const res: any[] = [];

		for await (const part of parts) {
			const created = await this._PartsService.create(part, {
				_id: new ObjectId("6005ebf0ed5edb209c0858bb"),
			} as IUser);
			res.push(created);
		}
		return res;
	}

	private preparePartsForUpload(
		args: IAPrepareDataForUpload
	): IRPrepareDataForUpload {
		const comparator = (a: { oem: string }, b: { oem: string }) => {
			if (a.oem > b.oem) return 1;
			else if (a.oem < b.oem) return -1;
			return 0;
		};
		// sort arrays by oem
		const parsed = args.parsed.sort(comparator);
		const autoCompleted = args.autoCompleted.sort(comparator);
		const partsForUpload: IAPOSTPart[] = [];

		// iterate array and collect parts for upload
		for (let i = 0; i < autoCompleted.length; i++) {
			const parsedEl = parsed[i];
			const autocompletedEl = autoCompleted[i];
			if (!parsedEl && !autocompletedEl) continue;

			const imageName = args.images[parsedEl.imageName]?.uploadedName;
			const images: string[] = [];
			if (!!imageName) images.push(imageName);
			const partForUpload: IAPOSTPart = {
				images,
				oem: autocompletedEl.oem,
				manufacturerType: args.carManufacturerType,
				price: parsedEl.price,
				modificationIds: autocompletedEl.modificationIds,
				productId: autocompletedEl.productId,
				quantity: 1,
				title: autocompletedEl.title,
				description: parsedEl.description,
				supplier: undefined,
				barCode: undefined,
				tags: [],
			};
			partsForUpload.push(partForUpload);
		}
		return partsForUpload;
	}

	private async autoCompleteByManyOem(args: {
		type: ECarManufacturerTypes;
		oems: string[];
	}): Promise<IRAutoCompleteByManyOem> {
		const { oems, type } = args;
		const response: IRAutoCompleteByManyOem = {
			completed: [],
			uncompleted: { hasManyProductId: [], notExist: [] },
		};

		for await (const oem of oems) {
			let autocompletedPart: IRGETAutocompleteByOem | never;
			try {
				autocompletedPart = await this._SqlArticlesService.getAutoCompleteByOem(
					{
						oem,
						type,
					}
				);
				if (autocompletedPart.length > 1) {
					response.uncompleted.hasManyProductId.push(oem);
					console.log("Has many productId : ", oem);
				}
				response.completed.push({ oem, ...autocompletedPart[0] });
			} catch {
				response.uncompleted.notExist.push(oem);
				console.log("Not exist : ", oem);
			}
		}
		return response;
	}

	public async parse(fileName: string): Promise<IRPOPSTExcelParser> {
		let data: IRPOPSTExcelParser;
		try {
			data = await this.runParserScript();
		} catch (err) {
			this.actionAfterParse(fileName);
			throw new MError(500, err.message);
		}
		return data;
	}

	private async runParserScript(): Promise<IParsedDataFromExcel[]> {
		const pyScriptPath = join(rootDir, "../", "Parser", "main.py");
		let data = "[]";
		let partsList: IParsedDataFromExcel[] = [];
		try {
			//convert Buffer data to String
			data = (await spawn("python", [pyScriptPath])).toString();
			partsList = JSON.parse(data);
		} catch (err) {
			console.log(err.stderr?.toString() ?? err);
			throw Error(`Python parser error!`);
		}
		return partsList;
	}

	private actionAfterParse(excelFileName = "data.xlsx") {
		const imagesDir = join(
			rootDir,
			"uploads",
			"excel-files",
			"parsed",
			"images"
		);
		//delete all images
		rimraf.sync(imagesDir);

		//create folder for images
		fs.mkdirSync(imagesDir);

		//delete temp excel file
		fs.unlinkSync(join(rootDir, "uploads/excel-files", excelFileName));
	}
}
