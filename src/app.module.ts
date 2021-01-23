import { Module } from "@nestjs/common";
import { Resources } from "./resources";

@Module({
	imports: Resources.Imports,
	controllers: Resources.Controllers,
	providers: Resources.Providers,
})
export class AppModule {}
