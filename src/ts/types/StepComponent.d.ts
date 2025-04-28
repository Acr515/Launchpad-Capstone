type StepComponent = {
	/** Unique string id for the step. */
	id: string;
	/** If defined, turns this step into a subheading step, which will place a dot on the progress bar. */
	subheading?: string;
	/** The element to show, which will be wrapped inside of a StepWrapper component. */
	element: React.JSX.Element;
	/** Whether to hide the step number of the wrapper. Best used for the final step. */
	hideStepNumber?: boolean;
};

export default StepComponent;