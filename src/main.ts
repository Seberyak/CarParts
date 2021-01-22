import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorFilter } from "./api/error-filter";
import * as localtunnel from "localtunnel";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new ErrorFilter());
	await app.listen(3000);
	app.enableCors();

	const tunnel = await localtunnel({ port: 3000, subdomain: "car-parts" });
	console.log(`Your server is able at domain ${tunnel.url}`);
	tunnel.on("close", () => {
		// tunnels are closed
	});
}

bootstrap();
