import { Module } from "@nestjs/common";
import { AppController } from "./api/app/app.controller";
import { AppService } from "./core/services/app";
import { AuthController } from "./api/auth/controller";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "./core/models/typegoose/users";
import { MulterModule } from "@nestjs/platform-express";
import { File } from "./core/models/typegoose/files";
import { GridFsMulterConfigService } from "./core/services/files/gridfs-multer-config-service";
import { FilesController } from "./api/files/controller";
import { FilesService } from "./core/services/files";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [
		TypegooseModule.forRoot("mongodb://localhost:27017/nest", {
			useNewUrlParser: true,
		}),
		TypegooseModule.forFeature([User, File]),
		// MulterModule.register({ dest: "./uploads" }),
		MulterModule.registerAsync({
			useClass: GridFsMulterConfigService,
		}),
		MongooseModule.forRoot("mongodb://localhost:27017/nest"),
	],
	controllers: [AppController, AuthController, FilesController],
	providers: [AppService, GridFsMulterConfigService, FilesService],
})
export class AppModule {}
