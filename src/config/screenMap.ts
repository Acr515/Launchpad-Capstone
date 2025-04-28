import Modules from 'tsx/screens/Modules';
import type ScreenProps from 'ts/types/ScreenProps';
import TaskStepInterface from 'tsx/screens/TaskStepInterface';
import ViewModule from 'tsx/screens/ViewModule';
import Welcome from 'tsx/screens/Welcome';

const screenMap: Record<string, (props: ScreenProps) => React.JSX.Element> = {
	'5b8f1ae9': Welcome,	// Welcome
	'4cc29a5b': Modules,	// Modules
	'fee3c5f3': ViewModule,	// View Module
	'c4b531af': TaskStepInterface,	// Step Interface
};
export default screenMap;