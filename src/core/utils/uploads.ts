import { HttpStatus } from "@nestjs/common";
import { extname } from "path";
import { MError } from "./errors";

export const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return callback(
			new MError(HttpStatus.BAD_REQUEST, "Only image files are allowed!"),
			false
		);
	}
	callback(null, true);
};

export const editFileName = (req, file, callback) => {
	const name = file.originalname.split(".")[0];
	const fileExtName = extname(file.originalname);
	const randomName = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 10).toString(10))
		.join("");
	callback(null, `${name}${randomName}${fileExtName}`);
};

export const excelFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(xlx|xlsx|csv)$/)) {
		return callback(
			new MError(
				HttpStatus.BAD_REQUEST,
				"Only excel files format are allowed!"
			),
			false
		);
	}
	callback(null, true);
};
