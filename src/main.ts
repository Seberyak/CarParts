import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorFilter } from "./api/error-filter";
import { NgrokService } from "./core/services/ngrok";
require("dotenv").config();
import * as fs from "fs";
import path from "path";

async function bootstrap() {
	const apiPort = parseInt(process.env.API_PORT) || 3000;

	const httpsOptions = {
		key: fs.readFileSync("./secrets/private-key.pem"),
		cert: fs.readFileSync(
			"./home/valera/Documents/CarParts/secrets/public-certificate.pem"
		),
	};
	const app = await NestFactory.create(AppModule, { httpsOptions });
	app.useGlobalFilters(new ErrorFilter());
	await app.listen(apiPort);
	app.enableCors();
	await new NgrokService(app).start();
	await console.log(
		`=======================Api started=======================`
	);
	console.log(`localhost:${apiPort}`);
}

bootstrap();
