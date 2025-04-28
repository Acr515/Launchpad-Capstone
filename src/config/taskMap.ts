import CreateYourVSCodeProject from 'tsx/tasks/3.1';
import CreateYourVSCodeProject_Assets from 'tsx/tasks/3.1/assets';
import ImageYourRoboRIO from 'tsx/tasks/2.1';
import ImageYourRoboRIO_Assets from 'tsx/tasks/2.1/assets';
import InstallFRCGameToolsTask from 'tsx/tasks/1.1';
import InstallFRCGameToolsTask_Assets from 'tsx/tasks/1.1/assets';
import type StepComponent from 'ts/types/StepComponent';
import type TaskInterfaceOptions from 'ts/types/TaskInterfaceOptions';

type TaskData = {
	assets: Record<string, string>;
	elements: (options: TaskInterfaceOptions) => StepComponent[];
};

const taskMap: Record<string, TaskData> = {
	'13e683c4': {
		assets: InstallFRCGameToolsTask_Assets,
		elements: InstallFRCGameToolsTask,
	},
	'41b9f0e0': {
		assets: ImageYourRoboRIO_Assets,
		elements: ImageYourRoboRIO,
	},
	'c430b9a1': {
		assets: CreateYourVSCodeProject_Assets,
		elements: CreateYourVSCodeProject,
	},
};

export default taskMap;