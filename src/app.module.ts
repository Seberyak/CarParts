import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from "@nestjs/common";
import { Resources } from "./resources";
import { RequestsLoggerMiddleware } from "./api/middlewares";

@Module({
	imports: Resources.Imports,
	controllers: Resources.Controllers,
	providers: Resources.Providers,
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RequestsLoggerMiddleware)
			.forRoutes({ path: "*", method: RequestMethod.ALL });
	}
}
