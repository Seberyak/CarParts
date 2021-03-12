import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorFilter } from "./api/error-filter";
import * as fs from "fs";
import { join } from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

async function bootstrap() {
	const apiPort = parseInt(process.env.API_PORT) || 3000;
	const path = join(__dirname, "../../", "/secrets");
	const httpsOptions = {
		key: fs.readFileSync(join(path, "key.pem")),
		cert: fs.readFileSync(join(path, "public-certificate.pem")),
	};
	const app = await NestFactory.create(AppModule, { httpsOptions });
	app.useGlobalFilters(new ErrorFilter());
	app.enableCors();
	await app.listen(apiPort);
	await console.log(
		`=======================Api started=======================`
	);
	console.log(`localhost:${apiPort}`);
}

bootstrap();
