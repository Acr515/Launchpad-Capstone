import TaskProgressBar, { type ITaskProgressBarRef } from 'tsx/components/TaskProgressBar';
import { createRef, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import Image from 'tsx/components/Image';
import ScreenProps from 'ts/types/ScreenProps';
import type StepComponent from 'ts/types/StepComponent';
import StepWrapper from 'tsx/components/StepWrapper';
import TaskBubble from 'tsx/components/TaskBubble';
import Tooltip from 'tsx/components/Tooltip';
import getScaleTransitionCallback from 'ts/util/getScaleTransitionCallback';
import images from 'assets/images';
import taskMap from 'config/taskMap';
import useRoutingTransition from 'ts/hooks/useRoutingTransition';
import './style.scss';

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
}

/** The percentage away from the top of the screen that a step must be to set it to active. */
const STEP_ACTIVATION_PADDING = -0.25;
/** The percentage away from the top of the screen that the last step must be to set it to active. */
const LAST_STEP_ACTIVATION_PADDING = 0.75;

export default function TaskStepInterface(props: ScreenProps): React.JSX.Element {
	const application = useContext(ApplicationContext);

	// Scroll to a certain step
	const scrollToStep = (index: number): void => {
		const scrollY = stepRefs.current[index].current?.offsetTop ?? 0;
		scrollContainerRef.current?.scrollTo({
			behavior: 'smooth',
			top: Math.max(0, scrollY - 24),
		});
	};

	const toggleBookmark = () => {
		if (application === null || typeof props?.taskStepInterface === 'undefined') { return; }
		application.setBookmark(props.taskStepInterface.task.id, activeStep);
	};

	// Back button handler
	const goBack = () => {
		if (props?.transition?.transitionState !== 'idle' || typeof props?.taskStepInterface === 'undefined') { return; }
		application?.router.setScreen({
			direction: -1,
			previousProps: {
				taskStepInterface: {
					...props.taskStepInterface,
					scrollAmount: scrollContainerRef.current?.scrollTop ?? 0,
				},
			},
		});
	};

	// Declare shorthands
	const mod = props?.taskStepInterface?.mod;
	const task = props?.taskStepInterface?.task;
	const colors = {
		primaryColor: mod?.primaryColor ?? '#fff',
		secondaryColor: mod?.secondaryColor ?? '#bbb',
		neutralColor: mod?.neutralColor ?? 'black',
	};
	const steps = taskMap[task?.id ?? 0].elements({
		jumpTo: scrollToStep,
		colors,
	});

	// Ref and state hooks
	const [activeStep, setActiveStep] = useState(0);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const backRef = useRef<HTMLButtonElement>(null);
	const bubbleRef = useRef<HTMLDivElement>(null);
	const bookmarkRef = useRef<HTMLButtonElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const progressContainerRef = useRef<ITaskProgressBarRef>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const stepRefs = useRef(Array.from({ length: steps?.length ?? 0 }, () => createRef<HTMLDivElement>()));
	const bookmarks = application?.getTaskBookmarks(task?.id ?? '') ?? [];

	// Attach event handlers
	useLayoutEffect(() => {
		const scrollParent = scrollContainerRef.current;
		const sidebar = sidebarRef.current;
		const progressBar = progressContainerRef.current;
		if (scrollParent === null || sidebar === null) { return; }

		scrollParent.scrollTop = props?.taskStepInterface?.scrollAmount ?? 0;

		const onScroll = () => {
			const scrollTop = scrollParent.scrollTop;

			// Set the position of the progress marker
			progressBar?.handleParentScroll(scrollTop, scrollParent.scrollHeight);

			// Check for changes in currently active step
			for (const [index, ref] of stepRefs.current.entries()) {
				const element = ref.current;
				if (element === null) { continue; }
				const isLast = index === stepRefs.current.length - 1;
				const isSecondToLast = index === stepRefs.current.length - 2;
				const scrollTarget = !isLast ?
					scrollTop + (scrollParent.clientHeight * STEP_ACTIVATION_PADDING)
					:
					scrollTop + (scrollParent.clientHeight * LAST_STEP_ACTIVATION_PADDING);
				if ((!isLast && element.offsetTop > scrollTarget) || (isLast && element.offsetTop < scrollTarget)) {
					setActiveStep(Math.max(0, index));
					if (!isSecondToLast) { break; }
				}
			}
		};

		scrollParent.addEventListener('scroll', onScroll);
		onScroll();

		return () => {
			scrollParent.removeEventListener('scroll', onScroll);
		};
	}, [props?.taskStepInterface?.scrollAmount]);

	// Define transition properties
	const { animationClass } = useRoutingTransition(application?.router?.direction ?? 1, props?.transition?.transitionState, {
		forwardIn: [
			{
				ref: bubbleRef,
				callback: getScaleTransitionCallback(props?.elementRects?.bubble),
			},
			{
				ref: titleRef,
				callback: getScaleTransitionCallback(props?.elementRects?.title),
			},
			{
				ref: backRef,
				callback: getScaleTransitionCallback(props?.elementRects?.backButton),
			},
			{
				ref: sidebarRef,
				style: { 'background-color': 'transparent' },
			},
			{
				ref: bookmarkRef,
				style: { transform: 'translateX(-250%)' },
			},
			{
				specializedRef: progressContainerRef,
				style: { transform: 'translateX(-200%)' },
			},
			{
				ref: scrollContainerRef,
				style: {
					transform: 'translateY(25%)',
					opacity: '0',
				},
			},
		],
		backwardOut: [
			{
				ref: sidebarRef,
				style: {
					'background-color': 'transparent',
					'transform': 'translateX(-100%)',
				},
			},
			{
				ref: scrollContainerRef,
				style: {
					transform: 'translateY(25%)',
					opacity: '0',
				},
			},
			{
				ref: titleRef,
				style: {
					transform: 'translateY(-250%)',
				},
			},
		],
	});

	// Create step elements
	const stepElementList = useMemo(() => {
		if (steps === null) { return null; }
		const mapStepElements = (stepElement: StepComponent, index: number) => {
			if (steps === null) { return null; }
			return (
				<StepWrapper
					index={index}
					isActive={activeStep >= index}
					key={index}
					isFinal={index === steps.length - 1}
					subheading={stepElement.subheading ?? null}
					stepRef={stepRefs.current[index]}
					hideStepNumber={stepElement.hideStepNumber ?? false}
				>
					{stepElement.element}
				</StepWrapper>
			);
		};
		return steps.map(mapStepElements);
	}, [steps, activeStep]);

	if (application === null || props === null || typeof props.taskStepInterface === 'undefined' || typeof mod === 'undefined') { return TaskStepInterfaceNull(); }

	const cssVariables: ICSSVariables = {
		'--primary-color': mod.primaryColor,
		'--secondary-color': mod.secondaryColor,
	};

	return (
		<div className='_TaskStepInterface _Screen' style={cssVariables}>
			<ColorSchemeContext.Provider value={colors}>
				<div className={`sidebar ${animationClass}`} ref={sidebarRef}>
					<div className='back-button-column'>
						<button className={`back-button ${animationClass}`} onClick={goBack} ref={backRef}>
							<Image className='back-button-image' icon image={images.icons.back} manageColor={false} />
						</button>
					</div>
					<div className='progress-column'>
						<div className={`progress-task-bubble-container ${animationClass}`} ref={bubbleRef}>
							<TaskBubble className='progress-task-bubble' task={task!} mod={mod!} size='large' />
						</div>
						<TaskProgressBar
							bookmarks={bookmarks}
							taskId={task?.id ?? ''}
							ref={progressContainerRef}
							stepRefs={stepRefs.current}
							scrollableElement={scrollContainerRef}
							activeStep={activeStep}
							steps={steps}
							scrollToStep={scrollToStep}
							className={`progress-bar ${animationClass}`}
						/>
						<button className={`bookmark-button ${animationClass}`} ref={bookmarkRef} onClick={toggleBookmark}>
							<Image
								manageColor={false}
								className='bookmark-button-icon'
								icon
								image={images.icons.bookmark}
							/>
							<Image
								manageColor={false}
								className={`bookmark-button-fill${bookmarks.includes(activeStep) ? ' visible' : ''}`}
								icon
								image={images.icons.bookmarkFilled}
							/>
							<Tooltip className='bookmark-button-tooltip'>
								<h3 className='bookmark-button-tooltip-text'>{bookmarks.includes(activeStep) ? 'Remove' : 'Add'} Bookmark</h3>
							</Tooltip>
						</button>
					</div>
				</div>
				<div className='content-area'>
					<div className='heading'>
						<h1 ref={titleRef} className={`task-title ${animationClass}`}>{task!.title}</h1>
					</div>
					<div className={`step-container ${animationClass}`} ref={scrollContainerRef}>
						{stepElementList}
					</div>
				</div>
			</ColorSchemeContext.Provider>
		</div>
	);
}

function TaskStepInterfaceNull(): React.JSX.Element {
	return (
		<div className='_TaskStepInterface is-null'>
			<p>TaskStepInterface screen failed to render: Application and/or props read as null</p>
		</div>
	);
}