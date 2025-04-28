import { type HTMLAttributes, forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import BookmarkIndicator from '../BookmarkIndicator';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import ProgressBarMarker from '../ProgressBarMarker';
import type StepComponent from 'ts/types/StepComponent';
import SubsectionIndicator from '../SubsectionIndicator';
import type WritableStyleRef from 'ts/types/WritableStyleRef';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLDivElement> {
	/** Refs for all of the step elements. */
	readonly stepRefs: React.RefObject<HTMLDivElement>[];
	/** The scrollable element within the parent containing all the steps. */
	readonly scrollableElement: React.RefObject<HTMLDivElement>;
	/** The string ID of the task being displayed. */
	readonly taskId: string;
	/** The currently active step. */
	readonly activeStep: number;
	/** Each step element as specified in the task map for the active task. */
	readonly steps: StepComponent[];
	/** The function used to scroll to a specific step. */
	readonly scrollToStep: (index: number) => void;
	/** State data tracking the bookmarks for the current task. */
	readonly bookmarks: number[];
}

export interface ITaskProgressBarRef extends WritableStyleRef {
	/**
	 * Responds to scrolling within the element containing
	 * @param scrollTop The amount scrolled in the container.
	 * @param scrollHeight The scroll height of the container.
	 */
	handleParentScroll: (scrollTop: number, scrollHeight: number) => void;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
	'--neutral-color': string;
	'--neutral-color-inverted': string;
}

function TaskProgressBar(props: IProps, ref: React.Ref<ITaskProgressBarRef | null>): React.JSX.Element {
	const { scrollToStep } = props;
	const [hoveredStep, setHoveredStep] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const progressBarHitboxRef = useRef<HTMLDivElement>(null);
	const progressBarMarkerRef = useRef<HTMLDivElement>(null);
	const colors = useContext(ColorSchemeContext);

	/**
	 * Provides specific functionality to `TaskStepInterface`.
	 */
	useImperativeHandle(ref, () => ({
		handleParentScroll: (scrollTop: number, scrollHeight: number) => {
			const markerAmount = scrollTop / ((scrollHeight) - (containerRef.current?.clientHeight ?? 0));
			progressBarRef.current?.style.setProperty('--y', `${markerAmount}`);
		},
		setStyleProperty: (key: string, value: string) => {
			containerRef.current?.style.setProperty(key, value);
		},
		forceReflow: () => {
			containerRef.current?.getBoundingClientRect();
		},
	}));

	/**
	 * Gets the step number of a step based on its position.
	 * @param y A number between 0 and 1 corresponding to how far from the top of the scrollable area to search for a step.
	 * @returns The index of the step found. -1 if no step could be found.
	 */
	const getStepFromPosition = (y: number): number => {
		const scrollableElement = props.scrollableElement.current;
		if (scrollableElement === null) { return -1; }
		let previousEndTarget = 1;
		for (const [index, ref] of props.stepRefs.entries()) {
			const element = ref.current;
			if (element === null) { continue; }

			const offsetStartTarget = element.offsetTop / scrollableElement.scrollHeight;
			const offsetEndTarget = (element.offsetTop + element.offsetHeight) / scrollableElement.scrollHeight;
			if (y >= offsetStartTarget && y < offsetEndTarget) {
				return index;
			} else if (y < offsetEndTarget && y > previousEndTarget) {
				return index - 1;
			}
			previousEndTarget = offsetEndTarget;
		}
		return -1;
	};

	/**
	 * Handles mouse movements on the progress bar hitbox, showing the ghost marker.
	 */
	const onMouseMove = (e: MouseEvent) => {
		const progressBar = progressBarRef.current;
		if (progressBar === null) { return; }
		const rect = progressBar.getBoundingClientRect();
		const hoverPosition = (e.clientY - rect.top) / progressBar.clientHeight;
		const stepIndex = getStepFromPosition(hoverPosition);
		progressBar.style.setProperty('--hover-y', `${hoverPosition}`);
		if (stepIndex !== -1 && stepIndex !== hoveredStep) {
			setHoveredStep(stepIndex);
			if (stepIndex !== props.activeStep) {
				progressBarHitboxRef.current?.classList.remove('hide-ghost');
				progressBarHitboxRef.current?.classList.remove('show-active-number');
			}
		}
		if (stepIndex === props.activeStep) {
			progressBarHitboxRef.current?.classList.add('hide-ghost');
			progressBarHitboxRef.current?.classList.add('show-active-number');
		}
	};

	/**
	 * Handles leaving the progress bar hitbox, removing CSS classes for displaying the active number
	 */
	const onMouseLeave = () => {
		progressBarHitboxRef.current?.classList.remove('hide-ghost');
		progressBarHitboxRef.current?.classList.remove('show-active-number');
	};

	const onClick = (e: MouseEvent) => {
		const progressBar = progressBarRef.current;
		if (progressBar === null) { return; }
		const rect = progressBar.getBoundingClientRect();
		const hoverPosition = (e.clientY - rect.top) / progressBar.clientHeight;
		const stepIndex = getStepFromPosition(hoverPosition);
		if (stepIndex !== -1) {
			scrollToStep(stepIndex);
			progressBarHitboxRef.current?.classList.add('hide-ghost');
		}
	};

	// Attach event listeners to progress bar hitbox.
	useEffect(() => {
		const hitbox = progressBarRef.current;
		if (hitbox === null) { return; }
		hitbox.addEventListener('click', onClick);
		hitbox.addEventListener('mousemove', onMouseMove);
		hitbox.addEventListener('mouseleave', onMouseLeave);

		return () => {
			hitbox.removeEventListener('click', onClick);
			hitbox.removeEventListener('mousemove', onMouseMove);
			hitbox.removeEventListener('mouseleave', onMouseLeave);
		};
	});

	// Create step markers
	const stepMarkersList = useMemo(() => {
		const mapMarkers = (stepElement: StepComponent, index: number) => {
			const isBookmarked = props.bookmarks.includes(index);
			const isSubheading = typeof stepElement.subheading !== 'undefined';
			return (
				<ProgressBarMarker
					scrollFunction={props.scrollToStep}
					stepRef={props.stepRefs[index]}
					stepNumber={index}
					key={stepElement.id}
					tooltipLabel={isSubheading ? stepElement.subheading! : 'Bookmark'}
					interactive={props.activeStep !== index && (isBookmarked || isSubheading)}
				>
					{ isSubheading && <SubsectionIndicator
						active={props.activeStep >= index}
						interactive={props.activeStep !== index}
					/> }
					<BookmarkIndicator
						enabled={isBookmarked}
						active={props.activeStep === index}
						interactive={props.activeStep !== index}
					/>
				</ProgressBarMarker>
			);
		};
		return props.steps.map(mapMarkers);
	}, [props.steps, props.activeStep, props.scrollToStep, props.stepRefs, props.bookmarks]);

	const cssVariables: ICSSVariables = {
		'--primary-color': colors.primaryColor,
		'--secondary-color': colors.secondaryColor,
		'--neutral-color': colors.neutralColor === 'black' ? 'var(--col-base-dark)' : 'var(--col-base-text)',
		'--neutral-color-inverted': colors.neutralColor === 'black' ? 'var(--col-base-text)' : 'var(--col-base-dark)',
	};

	return (
		<div className={`_TaskProgressBar ${props.className ?? ''}`} ref={containerRef} style={cssVariables}>
			<div className='indicator-column'>
				{stepMarkersList}
			</div>
			<div className='progress-bar' ref={progressBarRef}>
				<div className='progress-hitbox' ref={progressBarHitboxRef}></div>
				<div className='progress-fill-beginning'></div>
				<div className='progress-fill'></div>
				<div className='current-marker-container'>
					<div className='current-marker' ref={progressBarMarkerRef}>
						<span className='marker-number'>{props.activeStep + 1}</span>
					</div>
				</div>
				<div className='ghost-marker-container'>
					<div className='ghost-marker'>
						<span className='marker-number'>{hoveredStep + 1}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default forwardRef(TaskProgressBar);