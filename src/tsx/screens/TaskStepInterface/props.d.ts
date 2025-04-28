import type { ModuleConfig, TaskConfig } from 'ts/types/ModuleData';

interface ITaskStepInterfaceProps extends HTMLAttributes<HTMLElement> {
	task: TaskConfig;
	mod: ModuleConfig;
	scrollAmount?: number;
}

export default ITaskStepInterfaceProps;