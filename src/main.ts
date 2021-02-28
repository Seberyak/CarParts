import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorFilter } from "./api/error-filter";
import { NgrokService } from "./core/services/ngrok";
require("dotenv").config();
import * as fs from "fs";
import { join } from "path";

async function bootstrap() {
	const apiPort = parseInt(process.env.API_PORT) || 3000;
	const path = join(__dirname, "../../", "/secrets");
	const httpsOptions = {
		key: fs.readFileSync(join(path, "key.pem")),
		cert: fs.readFileSync(join(path, "public-certificate.pem")),
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
