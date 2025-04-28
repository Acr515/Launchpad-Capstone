/**
 * Supertype for components with explicit ref types that need to be transitioned by `useRoutingTransition`.
 */
interface WritableStyleRef {
	/**
	 * Sets a style rule on the root element of the functional component that the ref points to.
	 * @param key The style property to set.
	 * @param value The value to assign to the property.
	 */
	setStyleProperty: (key: string, value: string) => void;
	/**
	 * Force a reflow on the root element of the functional component that the ref points to.
	 * Written to allow `useRoutingTransition` to function properly; use sparingly.
	 */
	forceReflow: () => void;
};

export default WritableStyleRef;