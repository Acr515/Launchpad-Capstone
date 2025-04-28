import { z } from 'zod';

export const SettingsSchema = z.object({
	/** Whether or not to show the background stars. */
	useStars: z.boolean(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const defaultSettings: Settings = {
	useStars: true,
};