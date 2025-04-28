import type IModulesProps from 'tsx/screens/Modules/props';
import type ITaskStepInterfaceProps from 'tsx/screens/TaskStepInterface/props';
import type IViewModuleProps from 'tsx/screens/ViewModule/props';
import type TransitionState from './TransitionState';

/**
 * Any data that could potentially be consumed by any screen component.
 */
type ScreenProps = {
	/** Data managed by the outlet to inform rendered screens of their status. Read-only outside of Outlet/Router. */
	transition?: {
		/** Indicates if a transition is ongoing and what this screen's role in it is. */
		transitionState: TransitionState;
		/** Indicates whether this screen is being shown primarily. */
		screenType: 'current' | 'previous' | 'lateral';
	};
	/** Ref objects of elements that need to transition between screens. */
	elementRects?: Record<string, DOMRect>;
	/** Props consumed only by the Modules screen. */
	modules?: IModulesProps;
	/** Props only consumed by the View Module screen. */
	viewModule?: IViewModuleProps;
	/** Props only consumed by the Task Step Interface screen. */
	taskStepInterface?: ITaskStepInterfaceProps;
} | null;

export default ScreenProps;