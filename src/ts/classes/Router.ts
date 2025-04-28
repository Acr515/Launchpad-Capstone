import { pushStateArray, spliceStateArray } from 'ts/util/stateArrayFunctions';
import Application from './Application';
import type ScreenProps from 'ts/types/ScreenProps';
import type StateObject from 'ts/types/StateObject';
import screenMap from 'config/screenMap';

type SetScreenOptions = {
	/** The destination URL of the screen as specified in the application config. */
	url?: string;
	/** A set of properties to assign to the new screen component. Defaults to null if not specified. */
	props?: ScreenProps;
	/** -1 if going backward, 1 otherwise. Defaults to 1 if not specified, which sufficiently covers most use cases. */
	direction?: -1 | 1;
	/** If specified, overwrites the current screen's props with a new object before navigating away. */
	previousProps?: ScreenProps;
};

/**
 * The router manages the screen state of the web-app. It also receives and distributes pertinent
 * state data for a screen.
 */
export default class Router {
	private screenStackState: StateObject<string[]> | null = null;
	private screenPropsState: StateObject<ScreenProps[]> | null = null;
	private stackIndexState: StateObject<number> | null = null;
	private previousStackIndexState: StateObject<number> | null = null;

	constructor(
		private readonly application: Application,
	) {}

	get stackIndex(): number {
		return this.stackIndexState?.value ?? -1;
	}

	get previousStackIndex(): number {
		return this.previousStackIndexState?.value ?? -1;
	}

	/** Returns a number representing the direction of the last navigational operation. 0 means the current screen navigated to a copy of itself. */
	get direction(): 1 | 0 | -1 {
		if (this.screenStack[this.stackIndex] === this.screenStack[this.previousStackIndex]) { return 0; }
		return this.stackIndex < this.previousStackIndex ? -1 : 1;
	}

	/** Gets the entire stack of screen URLs. */
	get screenStack(): string[] {
		if (this.screenStackState === null) {
			throw new Error('Router screenStack was accessed before router was initialized');
		}
		return this.screenStackState.value;
	}

	/**
	 * Gets the current URL.
	 * @returns A string correlating to a screen's URL.
	 */
	get screenUrl(): string {
		return this.screenStack[this.stackIndex];
	}

	/** Gets the entire stack of screen props. */
	get screenProps(): ScreenProps[] {
		if (this.screenPropsState === null) {
			throw new Error('Router screenProps was accessed before router was initialized');
		}
		return this.screenPropsState.value;
	}

	/**
	 * Distributes state data to class instances. Runs on each new render.
	 */
	// TODO: Is there a more React-y way of conducting these updates?
	assignState(screenStack: StateObject<string[]>, screenProps: StateObject<ScreenProps[]>, stackIndexState: StateObject<number>, previousStackIndexState: StateObject<number>): void {
		this.screenStackState = screenStack;
		this.screenPropsState = screenProps;
		this.stackIndexState = stackIndexState;
		this.previousStackIndexState = previousStackIndexState;
	}

	/**
	 * Gets the screen ID of a screen in the screen stack.
	 * @param stackIndex The index within the screen stack to search for.
	 * @returns The screen's string ID; if the screen wasn't found, null is returned.
	 */
	private getScreenId(stackIndex: number | null = null): string | null {
		if (this.screenStackState === null || this.stackIndexState === null || this.stackIndexState.value === -1) { return null; }
		const screens = this.screenStackState.value;
		const index = stackIndex ?? this.stackIndexState.value;
		if (index > screens.length - 1) { throw new Error('Requested screen index exceeds screen stack array bounds'); }
		const currentScreen = screens[index];
		for (const screen of this.application.config.screens) {
			if (screen.url === currentScreen) {
				return screen.id;
			}
		}
		return null;
	}

	/**
	 * Gets the JSX component function corresponding to the given screen.
	 * @param stackIndex The index within the stack to retrieve the screen for. If unspecified,
	 * gets the current screen.
	 * @returns A JSX element.
	 */
	getScreen(stackIndex: number | null = null): ((props: ScreenProps) => React.JSX.Element) | null {
		if (this.screenStackState === null || this.stackIndexState === null || this.stackIndexState.value === -1) { return null; }
		const index = stackIndex ?? this.stackIndexState.value;
		const id = this.getScreenId(index);
		return id === null ? null : screenMap[id];
	}

	/**
	 * Gets the prop object corresponding to the given screen.
	 * @param stackIndex The index within the stack to retrieve props for. If unspecified,
	 * gets the current screen.
	 * @returns A set of element props.
	 */
	getScreenProps(stackIndex: number | null = null): ScreenProps {
		if (this.screenPropsState === null || this.stackIndexState === null || this.stackIndexState.value === -1) { return null; }
		return this.screenPropsState.value[stackIndex ?? this.stackIndexState.value];
	}

	/**
	 * Gets the previous URL.
	 * @returns A string correlating to a screen's URL. Returns null if there is no previous screen.
	 */
	getPreviousScreenUrl(): string | null {
		if (this.previousStackIndex === -1) { return null; }
		return this.screenStack[this.previousStackIndex];
	}

	/**
	 * Navigate back to the previous screen.
	 */
	goBack(url?: string): void {
		this.setScreen({ direction: -1, url });
	}

	/**
	 * Navigate to a given screen.
	 * @param options A set of options for the operation.
	 */
	setScreen(options: SetScreenOptions): void {
		const url = options?.url ?? null;
		const props = options?.props ?? null;
		const direction = options?.direction ?? 1;
		const previousProps = options?.previousProps;
		let currentUrl = url;

		if (this.screenStackState === null || this.screenPropsState === null || this.stackIndexState === null || this.previousStackIndexState === null) { return; }
		this.previousStackIndexState.set(this.stackIndexState.value);
		switch (direction) {
			case -1: {
				// Go backward
				const currentIndex = this.stackIndexState.value;
				if (url === null) {
					// Go backward
					this.stackIndexState.set(currentIndex - 1);
					currentUrl = this.screenStack[currentIndex - 1];
				} else {
					// Dispose previous values in the stack
					let targetIndex = -1;
					for (let i = this.screenStack.length - 1; i >= 0; i--) {
						if (this.screenStack[i] === url) {
							targetIndex = i;
							break;
						}
					}
					if (targetIndex === -1) { return; }
					this.stackIndexState.set(targetIndex);
				}
				// Overwrite previous props if specified
				if (typeof previousProps !== 'undefined') {
					spliceStateArray(this.screenPropsState, currentIndex, 99, [previousProps]);
				}
				break;
			}
			case 1: {
				// Go forward
				if (url === null) { return; }
				const stackLastIndex = this.screenStackState.value.length - 1;
				const stackIndex = this.stackIndexState.value;
				const stackDifference = stackLastIndex - stackIndex;

				// Check previousProps argument
				const hasPreviousProps = typeof previousProps !== 'undefined';

				// Manipulate navigation stack
				if (stackDifference > 0) {
					// Overwrite stack with new entry
					spliceStateArray(this.screenStackState, stackLastIndex - stackDifference + 1, stackDifference, [url]);
					if (!hasPreviousProps) {
						spliceStateArray(this.screenPropsState, stackLastIndex - stackDifference + 1, stackDifference, [props]);
					} else {
						spliceStateArray(this.screenPropsState, stackLastIndex - stackDifference, stackDifference + 1, [previousProps, props]);
					}
					this.stackIndexState.set(stackIndex + 1);
				} else {
					// Simply append
					pushStateArray(this.screenStackState, url);
					if (!hasPreviousProps) {
						pushStateArray(this.screenPropsState, props);
					} else {
						spliceStateArray(this.screenPropsState, stackLastIndex, 1, [previousProps, props]);
					}
					this.stackIndexState.set(stackIndex + 1);
				}
				break;
			}
		}

		// Change background
		switch (currentUrl) {
			case 'welcome':
				this.application.setActiveBackground('welcome', null);
				break;
			case 'modules':
				this.application.setActiveBackground('neutral', null);
				this.application.stars?.updateOpacity(0.75);
				break;
			case 'view-module':
				this.application.setActiveBackground('module', props?.viewModule?.mod);
				if (typeof props?.viewModule?.mod === 'undefined') { break; }
				this.application.stars?.updateOpacity(0.5);
				break;
			case 'task-steps':
				this.application.setActiveBackground('module', props?.taskStepInterface?.mod);
				if (typeof props?.taskStepInterface?.mod === 'undefined') { break; }
				this.application.stars?.updateOpacity(0.25);
				break;
		}
	}

	/**
	 * Searches for the most recent occurrence of a url in the stack and overwrites
	 * its props with the provided object. Properties not specified are not modified.
	 * Search is conducted relative to the current stack index.
	 * @param url The url to search for.
	 * @param props The `ScreenProps`
	 */
	overwriteScreenProps(url: string, props: ScreenProps): void {
		if (this.screenPropsState === null) { return; }
		let stackIndex = -1;
		for (let i = this.stackIndex; i >= 0; i--) {
			if (url === this.screenStack[i]) {
				stackIndex = i;
				break;
			}
		}
		if (stackIndex === -1) { return; }
		const newPropArray = this.screenProps.map((p) => p);
		newPropArray[stackIndex] = {
			...this.screenProps[stackIndex],
			...props,
		};
		this.screenPropsState.set(newPropArray);
	}
}