import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ImageController } from "./controller";

@Module({
	controllers: [ImageController],
	imports: [MulterModule.register({ dest: "./uploads" })],
	providers: [],
})
export class ImagesModule {}
