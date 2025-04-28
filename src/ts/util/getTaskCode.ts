import { type Config } from 'ts/types/ScreenConfig';

/**
 * Gets a string representing the code of a task.
 * @param taskId The ID of the task to search for.
 * @param config The config object stored in the Application instance.
 * @returns The string x.y, where x is the index of the module and y is the index
 * of the task within the module.
 */
const getTaskCode = (taskId: string, config: Config): string => {
	for (const moduleIndex in config.modules) {
		const module = config.modules[moduleIndex];
		for (const taskIndex in module.tasks) {
			const task = module.tasks[taskIndex];
			if (task.id === taskId) {
				return `${parseInt(moduleIndex) + 1}.${parseInt(taskIndex) + 1}`;
			}
		}
	}
	return '?.?';
};

export default getTaskCode;