import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorFilter } from "./api/error-filter";

import { NgrokService } from "./core/services/ngrok";
require("dotenv").config();

async function bootstrap() {
	const apiPort = parseInt(process.env.API_PORT) || 3000;

	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new ErrorFilter());
	await app.listen(apiPort);
	app.enableCors();
	await new NgrokService().start();
	console.log(`=======================Api started=======================`);
	console.log(`localhost:${apiPort}`);
}

bootstrap();
