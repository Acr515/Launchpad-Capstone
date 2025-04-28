import type { ModuleConfig, TaskConfig } from 'ts/types/ModuleData';
import TaskListItem, { type ITaskListItemRef } from 'tsx/components/TaskListItem';
import { createRef, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Image from 'tsx/components/Image';
import type ScreenProps from 'ts/types/ScreenProps';
import getModuleDirectionTransitionCallback from 'ts/util/getModuleDirectionTransitionCallback';
import getScaleTransitionCallback from 'ts/util/getScaleTransitionCallback';
import images from 'assets/images';
import useRoutingTransition from 'ts/hooks/useRoutingTransition';
import './style.scss';

/**
 * Screen for viewing the tasks contained within a module.
 * @param props Props passed via the router.
 */
export default function ViewModule(props: ScreenProps): React.JSX.Element {
	const application = useContext(ApplicationContext);
	const headingRef = useRef<HTMLDivElement>(null);
	const headingTextRef = useRef<HTMLHeadingElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const backButtonRef = useRef<HTMLAnchorElement>(null);
	const itemRefs = useRef(Array.from({ length: props?.viewModule?.mod.tasks.length ?? 1 }, () => createRef<ITaskListItemRef>()));
	const mod = props?.viewModule?.mod;

	const getPreopenedTasks = () => itemRefs.current.map((item, index) => item.current?.isExpanded ? index : null).filter((item) => item !== null);

	// Define transition properties
	// TODO: Create a system for using this hook outside of class functions; it is getting very long
	const { animationClass } = useRoutingTransition(application?.router?.direction ?? 1, props?.transition?.transitionState, {
		forwardIn: [
			{
				ref: headingTextRef,
				callback: getScaleTransitionCallback(props?.elementRects?.header),
			},
			{
				ref: listRef,
				style: { transform: 'scale(0)' },
			},
		],
		backwardOut: [
			{
				ref: listRef,
				style: {
					transform: 'scale(0)',
					opacity: '0',
				},
			},
			{
				ref: headingRef,
				style: { opacity: '0' },
			},
		],
		forwardOut: [
			{
				ref: headingRef,
				style: { opacity: '0' },
			},
			{
				ref: listRef,
				style: {
					opacity: '0',
					transform: 'translateX(10%)',
				},
			},
		],
		backwardIn: [
			{
				ref: headingRef,
				style: { opacity: '0' },
			},
			{
				ref: backButtonRef,
				style: { opacity: '0' },
			},
			{
				ref: listRef,
				style: {
					opacity: '0',
					transform: 'translateX(10%)',
				},
			},
		],
		lateralOut: [
			{
				ref: listRef,
				callback: getModuleDirectionTransitionCallback(application, -1),
			},
			{
				ref: headingTextRef,
				style: {
					transform: 'translateY(-200%)',
				},
			},
		],
		lateralIn: [
			{
				ref: listRef,
				callback: getModuleDirectionTransitionCallback(application, 1),
			},
			{
				ref: headingTextRef,
				style: {
					transform: 'translateY(-200%)',
				},
			},
		],
	});

	// Automatically scroll to position
	useLayoutEffect(() => {
		const list = listRef.current;
		if (list === null) { return; }
		list.scrollTop = props?.viewModule?.scrollAmount ?? 0;
	}, [props?.viewModule?.scrollAmount]);

	// Check if this screen is appearing because of a lateral navigation
	useEffect(() => {
		if (application === null) { return; }
		if (props?.transition?.screenType === 'lateral' && props.transition.transitionState === 'in') {
			// Update the selected module on the Modules screen
			let moduleIndex = -1;
			for (const [index, configModule] of application.config.modules.entries()) {
				if (configModule === mod) {
					moduleIndex = index;
					break;
				}
			}
			if (moduleIndex === -1) { return; }
			application.router.overwriteScreenProps('modules', {
				modules: {
					currentModule: moduleIndex,
				},
			});
		}
	}, [props?.transition?.screenType, props?.transition?.transitionState, application, mod]);

	if (application === null || props === null || typeof props.viewModule === 'undefined' || typeof mod === 'undefined') { return ViewModuleNull(); }

	/** Attached to the back button to return to the Modules screen. */
	const goBack = () => {
		if (props?.transition?.transitionState !== 'idle') { return; }
		application.router.setScreen({
			direction: -1,
			url: 'modules',
			previousProps: {
				viewModule: {
					mod,
					scrollAmount: listRef.current?.scrollTop ?? 0,
					preopenedTasks: getPreopenedTasks(),
				},
			},
		});
		application.stars?.moveDelta({ z: -0.075 });
	};

	/** Passed to each TaskListItem child. Navigates to the task when executed. */
	const launchTask = (task: TaskConfig, elementRects: Record<string, DOMRect>) => {
		if (backButtonRef.current === null) { return; }
		application.router.setScreen({
			url: 'task-steps',
			props: {
				taskStepInterface: { task, mod },
				elementRects: {
					...elementRects,
					backButton: backButtonRef.current.getBoundingClientRect(),
				},
			},
			previousProps: {
				viewModule: {
					mod,
					scrollAmount: listRef.current?.scrollTop ?? 0,
					preopenedTasks: getPreopenedTasks(),
					launchedTaskIndex: mod.tasks.indexOf(task),
				},
			},
		});
	};

	const jumpToPrerequisite = (targetMod: ModuleConfig, targetTask: TaskConfig): void => {
		if (mod === targetMod) {
			// This task is in the currently viewed module
			highlightTask(targetTask);
		} else {
			// Navigate to lateral screen
			application.router.setScreen({
				url: 'view-module',
				props: {
					viewModule: {
						mod: targetMod,
					},
				},
				previousProps: {
					viewModule: {
						mod,
						preopenedTasks: getPreopenedTasks(),
						scrollAmount: listRef.current?.scrollTop ?? 0,
					},
				},
			});
		}
	};

	/** Passed to each TaskListItem child. Highlights a task if a prerequisite bubble is clicked when that task belongs to the same module. */
	const highlightTask = (task: TaskConfig) => {
		let index = -1;
		for (const [moduleIndex, moduleTask] of mod.tasks.entries()) {
			if (task === moduleTask) {
				index = moduleIndex;
				break;
			}
		}
		if (index === -1) { return; }

		const element = itemRefs.current[index].current;
		if (element === null) { return; }
		element.focus();
	};

	return (
		<div className='_ViewModule _Screen'>
			<div className={`heading ${animationClass}`} ref={headingRef}>
				<a className={`back-button ${animationClass}`} onClick={goBack} ref={backButtonRef}>
					<Image icon image={images.icons.back} className='back-button-image' manageColor={false} />
				</a>
				<h2 className={`module-title ${animationClass}`} ref={headingTextRef} >{mod.title}</h2>
			</div>
			<div className={`task-list ${animationClass}`} ref={listRef} >
				{
					mod.tasks.map((task, index) => {
						const isTransitioningOut = props?.transition?.transitionState === 'out' && application.router.direction === 1;
						return (
							<TaskListItem
								launchTask={launchTask}
								jumpToPrerequisite={jumpToPrerequisite}
								key={task.id}
								index={index}
								task={task}
								mod={mod}
								ref={itemRefs.current[index]}
								preopen={props?.viewModule?.preopenedTasks?.includes(index) ?? false}
								isLaunching={isTransitioningOut && props?.viewModule?.launchedTaskIndex === index}
							/>
						);
					})
				}
			</div>
		</div>
	);
}

function ViewModuleNull(): React.JSX.Element {
	return (
		<div className='_ViewModule is-null'>
			<p>ViewModule screen failed to render: Application and/or props read as null</p>
		</div>
	);
}