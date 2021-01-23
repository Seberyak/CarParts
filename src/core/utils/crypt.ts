import * as crypto from "crypto";
import * as fs from "fs";
import { join } from "path";
export function encode(key: string, plainText: string): string {
	const hashedKey = crypto
		.createHash("sha256")
		.update(key)
		.digest();

	const cipher = crypto.createCipheriv("rc4", hashedKey, "");
	// console.log(hashedKey);

	return cipher.update(plainText, "utf8", "hex");
}

export function decode(key: string, cipherText: string): string {
	const hashedKey = crypto
		.createHash("sha256")
		.update(key)
		.digest();
	const decipher = crypto.createDecipheriv("rc4", hashedKey, "");
	return decipher.update(cipherText, "hex", "utf8");
}

export function getKeyFromFile(): string {
	const path = join(__dirname, "../../../../", "hash-key");
	let key = "changeme";
	if (fs.existsSync(path)) {
		const keyFromFile = fs.readFileSync(path);
		key = keyFromFile.length > 0 ? keyFromFile.toString() : key;
	}
	return key;
}
