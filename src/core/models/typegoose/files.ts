import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";
import { IFile } from "../../../../schemas/file/helper-schemas";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@modelOptions(getTypegooseOptions("files"))
export class File implements Omit<IFile, "_id"> {
	@ApiModelProperty()
	@Prop()
	chunkSize: IFile["chunkSize"];

	@Prop()
	contentType: IFile["contentType"];

	@Prop()
	filename: IFile["filename"];

	@Prop()
	length: IFile["length"];

	@Prop()
	md5: IFile["md5"];
}
export type FileModel = ReturnModelType<typeof File>;
