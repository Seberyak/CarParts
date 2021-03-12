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
import { RequestsLoggerMiddleware } from "./api/middlewares";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SqlArticlesController } from "./api/sql-articles/controller";
import { SqlArticlesService } from "./core/services/sql-articles";
import { MigrationsService } from "./core/services/migrations";
import { MigrationsController } from "./api/migrations/controller";
import { PartsCartService } from "./core/services/parts-cart";
import { PartsCartController } from "./api/parts-cart/contorller";
import { PartCart } from "./core/models/typegoose/part-cart";
import { ExcelParserController } from "./api/excel-parser/controller";
import { ExcelParserService } from "./core/services/excel-parser";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export const Resources = {
	Controllers: [
		AppController,
		UsersController,
		FilesController,
		PartsController,
		AuthController,
		PartsRatingController,
		SqlArticlesController,
		MigrationsController,
		PartsCartController,
		ExcelParserController,
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
		RequestsLoggerMiddleware,
		SqlArticlesService,
		MigrationsService,
		PartsCartService,
		ExcelParserService,
	],
	Imports: [
		// ConfigModule.forRoot(),
		TypegooseModule.forRoot(
			`mongodb://${process.env.MONGO_IP ?? "localhost"}:${process.env
				.MONGODB_PORT ?? 27017}/nest`,
			{
				useNewUrlParser: true,
			}
		),
		// MulterModule.register({ dest: "./uploads" }),
		TypegooseModule.forFeature([User, File, Part, PartRating, PartCart]),
		MulterModule.registerAsync({
			useClass: GridFsMulterConfigService,
		}),
		MongooseModule.forRoot(
			`mongodb://${process.env.MONGO_IP ?? "localhost"}:${process.env
				.MONGODB_PORT ?? 27017}/nest`
		),
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: "2days" },
		}),
		TypeOrmModule.forRoot({
			type: "mysql",
			host: process.env.SERVER_IP || "localhost",
			port: toInt(process.env.MYSQL_PORT),
			username: process.env.MYSQL_USER || "root",
			password: process.env.MYSQL_PASSWORD || "password",
			database: process.env.MYSQL_DATABASE || "dt2019q2",
			entities: [],
			synchronize: true,
		}),
		ImagesModule,
	],
};

function toInt(args: string): number {
	let res = -1;
	try {
		res = parseInt(args);
	} catch {}
	return res;
}
