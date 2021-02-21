import * as ngrok from "ngrok";
import * as localtunnel from "localtunnel";
import { INestApplication } from "@nestjs/common";
require("dotenv").config();

export class NgrokService {
	private readonly API_PORT;
	private readonly NGROK_TOKEN;
	private readonly startLocalTunnelBool = true;
	constructor(private readonly app: INestApplication, port?: number) {
		this.API_PORT = port ?? process.env.API_PORT ?? 3001;
		this.NGROK_TOKEN = process.env.NGROK_TOKEN ?? "";
	}
	public async start(): Promise<void> {
		const mode = process.env.MODE;
		if (process.env.MODE !== "production") {
			console.log(
				`ngrok is not enable in ${mode} mode, switch to production.`
			);
			if (this.startLocalTunnelBool) await this.startLocaltunnel();
			return;
		}

		await ngrok.authtoken(this.NGROK_TOKEN);
		await ngrok.connect({ authtoken: this.NGROK_TOKEN });
		const url = await ngrok.connect({
			proto: "http", // http|tcp|tls, defaults to http
			addr: this.API_PORT, // port or network address, defaults to 80
			subdomain: "car-parts", // reserved tunnel name https://alex.ngrok.io
			authtoken: this.NGROK_TOKEN, // your authtoken from ngrok.com
			region: "eu", // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
		});
		console.log(url);
	}

	private async startLocaltunnel() {
		const tunnel = await localtunnel({
			port: this.API_PORT,
			subdomain: "car-parts",
		});
		console.log(`Your server is able at domain ${tunnel.url}`);
		tunnel.on("close", async () => {
			await this.app.close();
			console.log(`Server Closed!`);
		});
	}
}
