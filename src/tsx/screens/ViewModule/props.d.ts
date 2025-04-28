import type { ModuleConfig } from 'ts/types/ModuleData';

interface IViewModuleProps extends HTMLAttributes<HTMLElement> {
	mod: ModuleConfig;
	scrollAmount?: number;
	preopenedTasks?: number[];
	launchedTaskIndex?: number;
}
export default IViewModuleProps;