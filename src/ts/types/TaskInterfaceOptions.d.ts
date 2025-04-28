import { ColorScheme } from 'ts/context/ColorSchemeContext';

/**
 * An object passed directly to the function that generates the steps of a task.
 * Contains functionality provided by `TaskStepInterface` that the steps can tap into.
 */
type TaskInterfaceOptions = {
	/** Function that scrolls to the given step. */
	jumpTo: (index: number) => void;
	/** The color scheme of the current task. */
	colors: ColorScheme;
};

export default TaskInterfaceOptions;