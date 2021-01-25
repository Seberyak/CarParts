import { AppController } from "./api/app/app.controller";
import { UsersController } from "./api/users/controller";
import { FilesController } from "./api/files/controller";
import { PartsController } from "./api/parts/controller";
import { AuthController } from "./api/auth/controller";
import { PartsRatingController } from "./api/parts-rating/controller";
import { AppService } from "./core/services/app";
import { UsersService } from "./core/services/users";
import { GridFsMulterConfigService } from "./core/services/files/gridfs-multer-config-service";
import { FilesService } from "./core/services/files";
import { PartsService } from "./core/services/parts";
import { LocalStrategy } from "./core/services/users/local.strategy";
import { JwtStrategy } from "./core/services/auth/jwt.strategy";
import { JwtAuthGuard } from "./core/services/auth/jwt-auth.guard";
import { AuthService } from "./core/services/auth";
import { PartsRatingService } from "./core/services/parts-rating";
import { ConfigModule } from "@nestjs/config";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "./core/models/typegoose/users";
import { File } from "./core/models/typegoose/files";
import { Part } from "./core/models/typegoose/parts";
import { PartRating } from "./core/models/typegoose/parts-rating";
import { MulterModule } from "@nestjs/platform-express";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./core/services/auth/jwt.constants";
import { ImagesModule } from "./api/files/images/module";
import { CustomMiddleware } from "./api/middlewares";

export const Resources = {
	Controllers: [
		AppController,
		UsersController,
		FilesController,
		PartsController,
		AuthController,
		PartsRatingController,
	],

	Providers: [
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
		CustomMiddleware,
	],
	Imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRoot("mongodb://localhost:27017/nest", {
			useNewUrlParser: true,
		}),
		// MulterModule.register({ dest: "./uploads" }),
		TypegooseModule.forFeature([User, File, Part, PartRating]),
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
};
