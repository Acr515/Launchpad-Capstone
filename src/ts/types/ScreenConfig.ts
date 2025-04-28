import { MaterialConfigSchema, ModuleConfigSchema } from './ModuleData';
import { z } from 'zod';

const ScreenConfigSchema = z.object({
	/** The unique string id connected to the screen. */
	id: z.string(),
	/** A readable title to use for the screen. */
	title: z.string(),
	/**
	 * A lowercase, hyphenated string to serve as the url of the screen.
	 * Although this application doesn't leverage window history/navigation, treat this string like a url.
	 */
	url: z.string(),
	/** Currently unused. */
	screenTypes: z.optional(z.array(z.string())),
}).readonly();

export type ScreenConfig = z.infer<typeof ScreenConfigSchema>;

const HelpConfigSchema = z.object({
	icon: z.string(),
	heading: z.string(),
	text: z.string(),
	link: z.string(),
}).readonly();

export type HelpScreenConfig = z.infer<typeof HelpConfigSchema>;

export const ConfigSchema = z.object({
	/** Specific data corresponding to this application. */
	metadata: z.object({
		/** The title of the website. */
		title: z.string(),
		/** Determines how the application is displayed. */
		demo: z.boolean(),
		/** The path on the server where individual downloadable files are located. */
		files: z.string(),
	}),
	/** All of the screens in the application. */
	screens: z.array(ScreenConfigSchema),
	/** All of the content modules to be used throughout the application. */
	modules: z.array(ModuleConfigSchema),
	/** Prerequisite materials referenced by all tasks. */
	materials: z.array(MaterialConfigSchema),
	help: z.array(HelpConfigSchema),
}).readonly();

export type Config = z.infer<typeof ConfigSchema>;

/** Default application config, which is left empty. */
export const ConfigDefault: Config = {
	metadata: {
		title: 'undefined',
		demo: false,
		files: './files',
	},
	screens: [],
	modules: [],
	materials: [],
	help: [],
};