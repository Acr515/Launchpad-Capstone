import { Config, ConfigDefault, ConfigSchema } from 'ts/types/ScreenConfig';
import { ZodError, ZodSchema } from 'zod';

export default function parse<T>(json: unknown, schema: ZodSchema): T | null {
	let object: T | null = null;
	try {
		object = schema.parse(json);
	} catch (error) {
		if (error instanceof ZodError) {
			for (const issue of error.issues) {
				// eslint-disable-next-line no-console
				console.error('Validation failed: ', issue.message);
			}
		} else {
			// eslint-disable-next-line no-console
			console.error('Unexpected error: ', error);
		}
	}
	return object;
}

export function parseAppConfig(json: unknown): Config {
	const config = parse<Config>(json, ConfigSchema);
	return config === null ? ConfigDefault : config;
}