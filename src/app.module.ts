import { Module } from "@nestjs/common";
import { AppController } from "./api/app/app.controller";
import { AppService } from "./core/services/app";
import { UsersController } from "./api/users/controller";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "./core/models/typegoose/users";
import { MulterModule } from "@nestjs/platform-express";
import { File } from "./core/models/typegoose/files";
import { GridFsMulterConfigService } from "./core/services/files/gridfs-multer-config-service";
import { FilesController } from "./api/files/controller";
import { FilesService } from "./core/services/files";
import { MongooseModule } from "@nestjs/mongoose";
import { Part } from "./core/models/typegoose/parts";
import { PartsService } from "./core/services/parts";
import { PartsController } from "./api/parts/contorller";
import { LocalStrategy } from "./core/services/users/local.strategy";
import { AuthController } from "./api/auth/controller";
import { UsersService } from "./core/services/users";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./core/services/auth/jwt.constants";
import { JwtStrategy } from "./core/services/auth/jwt.strategy";
import { JwtAuthGuard } from "./core/services/auth/jwt-auth.guard";
import { AuthService } from "./core/services/auth";
import { PartRating } from "./core/models/typegoose/parts-rating";
import { PartsRatingController } from "./api/parts-rating/controller";
import { PartsRatingService } from "./core/services/parts-rating";
import { ImagesModule } from "./api/files/images/module";

@Module({
	imports: [
		TypegooseModule.forRoot("mongodb://localhost:27017/nest", {
			useNewUrlParser: true,
		}),
		TypegooseModule.forFeature([User, File, Part, PartRating]),
		// MulterModule.register({ dest: "./uploads" }),
		MulterModule.registerAsync({
			useClass: GridFsMulterConfigService,
		}),
		MongooseModule.forRoot("mongodb://localhost:27017/nest"),
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: "2days" },
		}),
		ImagesModule,
	],
	controllers: [
		AppController,
		UsersController,
		FilesController,
		PartsController,
		AuthController,
		PartsRatingController,
	],
	providers: [
		AppService,
		UsersService,
		GridFsMulterConfigService,
		FilesService,
		PartsService,
		LocalStrategy,
		JwtStrategy,
		JwtAuthGuard,
		AuthService,
		PartsRatingService,
	],
})
export class AppModule {}
