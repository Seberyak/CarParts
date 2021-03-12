import { Injectable } from "@nestjs/common";
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

///

const rootDir = join(__dirname, "../../../../../");

@Injectable()
export class ExcelParserService {
	constructor(private readonly _SqlArticlesService: SqlArticlesService) {}

	public async main(args: { type: ECarManufacturerTypes; fileName: string }) {
		const parts = await this.parse(args.fileName);
		const oems = parts.map(el => el.oem); //.slice(0, 20);
		const autoCompletedData = this.autoCompleteByManyOem({
			type: args.type,
			oems: oems,
		});
		console.log();
		return autoCompletedData;
	}

	private async autoCompleteByManyOem(args: {
		type: ECarManufacturerTypes;
		oems: string[];
	}) {
		const { oems, type } = args;

		const autoCompleteParts: IRGETAutocompleteByOem[number][] = [];
		const badOems: string[] = [];
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
					badOems.push(oem);
					console.log("Problem : ", oem);
				}
				autoCompleteParts.push(autocompletedPart[0]);
			} catch {
				badOems.push(oem);
				console.log("Problem : ", oem);
			}
		}
		return { good: autoCompleteParts, bad: badOems };
	}

	public async parse(fileName: string): Promise<IRPOPSTExcelParser> {
		let data: IRPOPSTExcelParser;
		try {
			data = await this.runParserScript();
		} catch (err) {
			this.actionAfterParse(fileName);
			throw new MError(500, err.message);
		}
		this.actionAfterParse(fileName);
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
