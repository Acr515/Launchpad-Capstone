import { z } from 'zod';

export const MaterialConfigSchema = z.object({
	/** Unique ID of this material. */
	id: z.string(),
	/** The display name of the material. */
	name: z.string(),
	/** The name of the image corresponding to this material. */
	imageName: z.string(),
	/** A description of this material to be shown on hover. */
	description: z.string(),
});

export type MaterialConfig = z.infer<typeof MaterialConfigSchema>;

export const TaskConfigSchema = z.object({
	/** Display name of the task. */
	title: z.string(),
	/** Unique ID of this task. */
	id: z.string(),
	/** Short paragraph description of what the user will be working towards during the task. */
	description: z.string(),
	/** An array of task IDs that need to be complete before this task can be started. */
	prerequisites: z.array(z.string()),
	/** An array of material IDs that need to be available to start this task. */
	neededMaterials: z.array(z.string()),
	/** Optional. If true, this task is explicitly inaccessible and a warning will block user access to it. */
	underConstruction: z.boolean().optional(),
});

export type TaskConfig = z.infer<typeof TaskConfigSchema>;

export const ModuleConfigSchema = z.object({
	/** The display name of the module. */
	title: z.string(),
	/** Unique ID of this task. */
	id: z.string(),
	/** Unused. Short paragraph description of what the user will be working towards during the module. */
	description: z.string().optional(),
	/** The primary color of the module. */
	primaryColor: z.string(),
	/** The secondary color of the module. */
	secondaryColor: z.string(),
	/** Changes the color used when displaying type or other elements on top of this module's color scheme. */
	neutralColor: z.union([
		z.literal('black'),
		z.literal('white'),
	]),
	/** An array of `TaskConfig` objects describing the tasks associated with this module. */
	tasks: z.array(TaskConfigSchema),
});

export type ModuleConfig = z.infer<typeof ModuleConfigSchema>;