import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorFilter } from "./api/error-filter";
import * as ngrok from "ngrok";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new ErrorFilter());
	await app.listen(3000);
	app.enableCors();

	const ngrokToken = "1nyQB5spBP83uq8E3Tb9PjheROw_4D4KgGhi48h6yG5hK1BeG";
	await ngrok.authtoken(ngrokToken);
	await ngrok.connect({ authtoken: ngrokToken });
	const url = await ngrok.connect({
		proto: "http", // http|tcp|tls, defaults to http
		addr: 3000, // port or network address, defaults to 80
		subdomain: "car-parts", // reserved tunnel name https://alex.ngrok.io
		authtoken: ngrokToken, // your authtoken from ngrok.com
		region: "eu", // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
	});
	console.log(url);
}

bootstrap();
