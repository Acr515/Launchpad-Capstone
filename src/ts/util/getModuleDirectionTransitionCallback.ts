import type Application from 'ts/classes/Application';

/**
 * Flips the direction of the lateral transition between modules depending on if the
 * targeted module is higher on the list of modules than the current screen's module.
 * Written for use **only with view-module lateral transitions.**
 * @param application The application object.
 * @param direction -1 if assigned to an out transition, 1 if assigned to an in transition.
 * @returns A callback function that can be executed by the `useRoutingTransition` hook.
 */
export default function getModuleDirectionTransitionCallback(application: Application | null, direction: 1 | -1): (element: HTMLElement | null) => React.CSSProperties | undefined {
	const nullFunction = (_: HTMLElement | null): React.CSSProperties => {
		return {};
	};
	if (application === null) { return nullFunction; }
	const router = application.router;
	const currentProps = router.screenProps[router.stackIndex];
	const previousProps = router.screenProps[router.previousStackIndex];
	if (typeof currentProps?.viewModule === 'undefined' || typeof previousProps?.viewModule === 'undefined') {
		return nullFunction;
	} else {
		const currentMod = currentProps.viewModule.mod;
		const previousMod = previousProps.viewModule.mod;
		return (_: HTMLElement | null): React.CSSProperties | undefined => {
			let currentModFound = false;
			for (const mod of application.config.modules) {
				if (mod === currentMod) {
					currentModFound = true;
				}
				if (mod === previousMod) {
					return {
						opacity: 0,
						transform: `translateX(${100 * direction * (currentModFound ? -1 : 1)}%)`,
					};
				}
			}
			return {};
		};
	}
}