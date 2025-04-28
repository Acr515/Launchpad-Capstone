import type { ModuleConfig, TaskConfig } from 'ts/types/ModuleData';
import type { Config } from 'ts/types/ScreenConfig';

/**
 * Retrieves the configuration of a task inside of its module.
 * @param taskId The ID of the task to search for.
 * @param config The Application instance's config object.
 * @returns An object containing properties `mod` and `task`; null if the ID
 * can't be found.
 */
const getTask = (taskId: string, config: Config): { mod: ModuleConfig; task: TaskConfig } | null => {
	for (const moduleIndex in config.modules) {
		const mod = config.modules[moduleIndex];
		for (const taskIndex in mod.tasks) {
			const task = mod.tasks[taskIndex];
			if (task.id === taskId) {
				return { mod, task };
			}
		}
	}
	return null;
};

export default getTask;