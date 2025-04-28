import { useLayoutEffect, useState } from 'react';
import type TransitionState from 'ts/types/TransitionState';
import WritableStyleRef from 'ts/types/WritableStyleRef';

type RoutingTransitionEntry = {
	/**
	 * The element to target. Works for most elements unless `forwardRef` and `useImperativeHandle` are necessary
	 * for the target; in that case, use `specializedRef` instead.
	 */
	ref?: React.RefObject<HTMLElement>;
	/**
	 * For refs that use the `forwardRef` and `useImperativeHandle` pattern, specify this property instead of `ref`.
	 * The ref for the specialized component should extend the `WritableStyleRef` type.
	 */
	specializedRef?: React.RefObject<WritableStyleRef>;
	/** Optional. Static styles to assign to the target element. */
	// TODO: Any way to type-check to avoid having to use Record<>? The type was added here because backgroundColor has a different spelling on the DOM side
	style?: React.CSSProperties | Record<string, string>;
	/** Optional. A callback function that dynamically assigns properties to the target element. */
	callback?: (element: HTMLElement | null) => React.CSSProperties | undefined;
};

type RoutingTransitionConfig = {
	forwardIn?: RoutingTransitionEntry[];
	forwardOut?: RoutingTransitionEntry[];
	backwardIn?: RoutingTransitionEntry[];
	backwardOut?: RoutingTransitionEntry[];
	lateralIn?: RoutingTransitionEntry[];
	lateralOut?: RoutingTransitionEntry[];
};

/**
 * Generates style rules to make any screen's elements transform during a routing animation. Elements
 * transitioning in this manner should modify their classes such that `transition` only applies when the
 * `initialized` return value of this function is true.
 * @param direction If the screen is being reached from in front of (1) or behind (-1) the stack.
 * @param transitionState `in` if the screen is the destination, and `out` if the screen is being departed from.
 * @param config The styles to assign to which elements during which routines.
 * @returns Boolean for whether the animation has initialized, and a string class to assign to elements.
 */
export default function useRoutingTransition(
	// TODO: Don't require this parameter. As a hook, this function can simply access application context itself
	direction: 1 | 0 | -1,
	transitionState: TransitionState | undefined,
	config: RoutingTransitionConfig,
): { initialized: boolean; animationClass: string } {
	// State declarations
	const [initialized, setInitialized] = useState(false);

	/**
	 * Utility function for succinctly changing style properties while type-checking ref and specializedRef.
	 * @param element The `.current` value of the `ref` property.
	 * @param specializedElement The `.current` value of the `specializedRef` property.
	 * @param key The style property to modify.
	 * @param value The new value to set.
	 */
	const setStyleProperty = (element: HTMLElement | null, specializedElement: WritableStyleRef | null, key: string, value: string): void => {
		if (element !== null) {
			element.style.setProperty(key, value);
		} else if (specializedElement !== null) {
			specializedElement.setStyleProperty(key, value);
		}
	};

	// Run on mount to set style
	useLayoutEffect(() => {
		if (typeof transitionState === 'undefined' || transitionState === 'idle') { return; }
		const activeTransitionConfig = getActiveConfig(direction, transitionState, config);

		if (typeof activeTransitionConfig !== 'undefined') {
			// Phase 1: assign initial properties
			for (const entry of activeTransitionConfig) {
				const element = entry.ref?.current ?? null;
				const specializedElement = entry.specializedRef?.current ?? null;
				if (element || specializedElement) {
					const style = typeof entry.callback !== 'undefined' ? entry.callback(element) : entry.style;
					if (typeof style === 'undefined') { break; }

					if (transitionState === 'in') {
						// Transition element INTO its spot in the DOM
						for (const [key, value] of Object.entries(style)) {
							setStyleProperty(element, specializedElement, key, value);
						}
						// Force rerender for certain elements that need it
						if (element !== null) {
							element.getBoundingClientRect();
						} else if (specializedElement !== null) {
							specializedElement.forceReflow();
						}
						setInitialized(true);
					} else {
						// Transition element OUT OF its spot in the DOM
						setInitialized(true);
					}
				}
			}
			// Phase 2: reset/add properties in animation frame
			requestAnimationFrame(() => {
				for (const entry of activeTransitionConfig) {
					const element = entry.ref?.current ?? null;
					const specializedElement = entry.specializedRef?.current ?? null;
					if (element || specializedElement) {
						const style = typeof entry.callback !== 'undefined' ? entry.callback(element) : entry.style;
						if (typeof style === 'undefined') { break; }
						if (transitionState === 'in') {
							// Transition element INTO its spot in the DOM
							for (const key of Object.keys(style)) {
								setStyleProperty(element, specializedElement, key, '');
							}
						} else {
							// Transition element OUT OF its spot in the DOM
							for (const [key, value] of Object.entries(style)) {
								setStyleProperty(element, specializedElement, key, value);
							}
						}
					}
				}
			});
		}
		// Disabling because this should only run on mount, and a remount occurs any time the transition state changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [direction, transitionState]);

	return {
		initialized,
		animationClass: `${initialized ? 'initialized' : ''}${typeof transitionState !== 'undefined' && transitionState !== 'idle' ? ` ${transitionState}` : ''} ${direction === 1 ? 'forward' : (direction === -1 ? 'backward' : 'lateral')}`,
	};
}

function getActiveConfig(
	direction: 1 | 0 | -1,
	transitionState: TransitionState | undefined,
	config: RoutingTransitionConfig,
): RoutingTransitionEntry[] | undefined {
	switch (direction) {
		case -1:
			return transitionState === 'in' ? config.backwardIn : config.backwardOut;
		case 0:
			return transitionState === 'in' ? config.lateralIn : config.lateralOut;
		case 1:
			return transitionState === 'in' ? config.forwardIn : config.forwardOut;
	}
}