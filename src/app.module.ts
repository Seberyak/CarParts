import { Module } from "@nestjs/common";
import { AppController } from "./api/app/app.controller";
import { AppService } from "./core/services/app";
import { AuthController } from "./api/auth/controller";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "./core/models/typegoose/user";

@Module({
	imports: [
		TypegooseModule.forRoot("mongodb://localhost:27017/nest", {
			useNewUrlParser: true,
		}),
		TypegooseModule.forFeature([User]),
	],
	controllers: [AppController, AuthController],
	providers: [AppService],
})
export class AppModule {}
