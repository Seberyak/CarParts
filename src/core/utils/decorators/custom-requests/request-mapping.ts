import { METHOD_METADATA, PATH_METADATA } from "@nestjs/common/constants";
import { RequestMethod } from "@nestjs/common";
import { encode, getKeyFromFile } from "../../crypt";

export interface RequestMappingMetadata {
	path?: string | string[];
	method?: RequestMethod;
	encoding?: boolean;
}

const defaultMetadata = {
	[PATH_METADATA]: "/",
	[METHOD_METADATA]: RequestMethod.GET,
	encoding: false,
};

export const RequestMapping = (
	metadata: RequestMappingMetadata = defaultMetadata
): MethodDecorator => {
	const pathMetadata = metadata[PATH_METADATA];
	const path = pathMetadata && pathMetadata.length ? pathMetadata : "/";
	const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET;

	const hashedPath = metadata.encoding
		? encode(getKeyFromFile(), Array.isArray(path) ? path.join() : path)
		: path;

	return (
		// eslint-disable-next-line @typescript-eslint/ban-types
		target: object,
		key: string | symbol,
		descriptor: TypedPropertyDescriptor<any>
	): any => {
		Reflect.defineMetadata(PATH_METADATA, hashedPath, descriptor.value);
		Reflect.defineMetadata(
			METHOD_METADATA,
			requestMethod,
			descriptor.value
		);
		return descriptor;
	};
};

const createMappingDecorator = (method: RequestMethod) => (
	path?: string | string[],
	encoding = false
): MethodDecorator => {
	return RequestMapping({
		[PATH_METADATA]: path,
		[METHOD_METADATA]: method,
		encoding,
	});
};

export const Post = createMappingDecorator(RequestMethod.POST);

export const Get = createMappingDecorator(RequestMethod.GET);

export const Delete = createMappingDecorator(RequestMethod.DELETE);

export const Put = createMappingDecorator(RequestMethod.PUT);

export const Patch = createMappingDecorator(RequestMethod.PATCH);

export const Options = createMappingDecorator(RequestMethod.OPTIONS);

export const Head = createMappingDecorator(RequestMethod.HEAD);

export const All = createMappingDecorator(RequestMethod.ALL);
