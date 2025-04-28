import type { ModuleConfig, TaskConfig } from 'ts/types/ModuleData';
import React, { type CSSProperties, type HTMLAttributes, type PropsWithChildren, forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Button from '../Button';
import Image from '../Image';
import TaskBubble from '../TaskBubble';
import Tooltip from '../Tooltip';
import getMaterial from 'ts/util/getMaterial';
import getTask from 'ts/util/getTask';
import getTaskCode from 'ts/util/getTaskCode';
import images from 'assets/images';
import loadImage from 'ts/util/loadImage';
import taskMap from 'config/taskMap';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	/** The task to which this element belongs. */
	task: TaskConfig;
	/** The module to which this element belongs. */
	mod: ModuleConfig;
	/** The function passed to the component which launches this element's task. */
	launchTask: (task: TaskConfig, elementRects: Record<string, DOMRect>) => void;
	/** The function passed to the component which jumps to a task in another module. */
	jumpToPrerequisite: (targetMod: ModuleConfig, targetTask: TaskConfig) => void;
	/** If specified, expands the description by default when mounted. */
	preopen?: boolean;
	/** If specified, makes bubble & header disappear to support the component's forward-out transition. */
	isLaunching?: boolean;
	/** The index of this task within the list of tasks. */
	index: number;
}

interface IPrerequisiteBubbleCSSVariables extends CSSProperties {
	'--color': string;
}

export interface ITaskListItemRef {
	focus: () => void;
	isExpanded: boolean;
}

type MaterialName = keyof typeof images.materials;

/**
 * A single entry within the list of tasks contained by a module.
 */
function TaskListItem(props: IProps, ref: React.Ref<ITaskListItemRef | null>): React.JSX.Element {
	const application = useContext(ApplicationContext);
	const [opened, setOpened] = useState(props.preopen ?? false);
	const [loadingTask, setLoadingTask] = useState(false);
	const baseRef = useRef<HTMLDivElement>(null);
	const bubbleRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const isLastTaskInModule = props.index === props.mod.tasks.length - 1;
	const hasTask = typeof taskMap[props.task.id] !== 'undefined';

	useImperativeHandle(ref, () => ({
		focus: () => {
			const element = baseRef.current;
			if (element === null) { return; }
			element.scrollIntoView({ behavior: 'smooth' });
			element.classList.add('emphasis');
			setTimeout(() => {
				element.classList.remove('emphasis');
			}, 2000);
		},
		isExpanded: opened,
	}));

	if (application === null) { return TaskListItemNull(); }

	/** Handles start button clicks. */
	const startTask = async () => {
		if (typeof taskMap[props.task.id] === 'undefined') { return; }
		const bubble = bubbleRef.current;
		const title = titleRef.current;
		const assets = taskMap[props.task.id].assets;
		if (bubble === null || title === null) { return; }

		setLoadingTask(true);

		const promises = Object.keys(assets).map((name) => {
			return loadImage(name, assets[name]);
		});

		await Promise.all(promises);

		props.launchTask(props.task, {
			bubble: bubble.getBoundingClientRect(),
			title: title.getBoundingClientRect(),
		});
	};

	/** Expands & retracts the description for this task. */
	const toggleExpand = () => setOpened(!opened);

	/** Maps prerequisite tasks into the element. */
	const mapPrerequisiteTasks = (id: string) => {
		const result = getTask(id, application.config);
		if (result === null) { return null; }
		const cssVariables: IPrerequisiteBubbleCSSVariables = {
			'--color': result.mod.primaryColor,
		};
		return (
			<div
				key={id}
				className='minor-item-container'
				onClick={() => props.jumpToPrerequisite(result.mod, result.task)}
			>
				<div className='bubble-container'>
					<TaskBubble
						className='prerequisite-bubble'
						task={result.task}
						mod={result.mod}
						size='small'
					/>
				</div>
				<span className='bubble-label' style={cssVariables}>
					{ getTaskCode(id, application.config) }
				</span>
				<Tooltip direction='top' className='minor-item-tooltip' arrowPosition='1.25em'>
					<span className='tooltip-small'>Jump to task:</span>
					<h3 className='tooltip-large'>{result.task.title}</h3>
				</Tooltip>
			</div>
		);
	};

	const mapNeededMaterials = (id: string) => {
		const material = getMaterial(id, application.config);
		if (material === null) { return null; }
		const image = images.materials[material.imageName as MaterialName];
		return (
			<div className='minor-item-container' key={id}>
				<div className='material-container'>
					<Image
						className='material-image'
						icon
						image={image}
						color='#fff'
					/>
				</div>
				<Tooltip {...(isLastTaskInModule && { flip: true })} direction='top' className={`minor-item-tooltip material-tooltip ${isLastTaskInModule ? 'last' : ''}`} arrowPosition='2.5em'>
					<h3 className='tooltip-large'>{material.name}</h3>
					<span className='tooltip-small'>{material.description}</span>
				</Tooltip>
			</div>
		);
	};

	return (
		<div className={`_TaskListItem ${opened ? 'opened' : ''}`} ref={baseRef}>
			<div className='task-bubble-wrapper'>
				<TaskBubble
					size='large'
					myRef={bubbleRef}
					className='bubble'
					task={props.task}
					mod={props.mod}
					style={{ visibility: props.isLaunching ? 'hidden' : 'visible' }}
				/>
			</div>
			<div className='task-title-wrapper'>
				<h3 className='task-title' ref={titleRef} style={{ visibility: props.isLaunching ? 'hidden' : 'visible' }}>{props.task.title}</h3>
			</div>
			<div className='launch-button-container'>
				<Button
					label='Launch'
					action={startTask}
					className='launch-button'
					primaryColor={props.mod.primaryColor}
					secondaryColor={props.mod.secondaryColor}
					loading={loadingTask}
					disabled={!hasTask}
				/>
				{ (!hasTask) && (
					<Tooltip className='task-unavailable-tooltip' flip>
						<p className='tooltip-text'>This task does not exist in this demo. Browse around to find other tasks!</p>
					</Tooltip>
				)}
			</div>
			<div className='task-description-wrapper'>
				<div className='description-filler'></div>
				<div className='task-description-container'>
					<p>{props.task.description}</p>
				</div>
			</div>
			<div className='prerequisite-task-wrapper'>
				<div className='attribute-header-container'>
					<h4 className='attribute-header'>Prerequisite Tasks</h4>
					<InfoHover><strong>Make sure</strong> that you've completed the listed tasks before beginning this task.</InfoHover>
				</div>
				<div className='minor-item-list'>
					{
						props.task.prerequisites.length > 0 ? (
							props.task.prerequisites.map(mapPrerequisiteTasks)
						) : (
							<span className='empty-label'>None</span>
						)
					}
				</div>
			</div>
			<div className='materials-needed-wrapper'>
				<div className='attribute-header-container'>
					<h4 className='attribute-header'>Materials Needed</h4>
					<InfoHover>You'll need the listed materials ready to go in order to complete this task.</InfoHover>
				</div>
				<div className='minor-item-list material-item-list'>
					{
						props.task.neededMaterials.length > 0 ? (
							props.task.neededMaterials.map(mapNeededMaterials)
						) : (
							<span className='empty-label'>None</span>
						)
					}
				</div>
			</div>
			<div className='expand-button-container'>
				<button type='button' className='expand-button' onClick={toggleExpand}>
					<span className='expand-label'>{opened ? 'Hide' : 'Show'} Description</span>
					<Image className='arrow' icon image={images.icons.chevron} manageColor={false} />
				</button>
			</div>
			<div className='bottom-border'></div>
		</div>
	);
}

export default forwardRef(TaskListItem);

function TaskListItemNull(): React.JSX.Element {
	return (
		<div className="_TaskListItem is-null">Error: application was null</div>
	);
}

/**
 * Shown next to task item subheadings to describe interactivity.
 */
function InfoHover(props: PropsWithChildren): React.JSX.Element {
	return (
		<span className='info-hover-container'>
			<span className='info-hover'>
				<Image className='info-hover-icon' image={images.icons.info} color='#000' icon/>
			</span>
			<Tooltip className='info-hover-tooltip'>
				<p className='tooltip-text'>{props.children}</p>
			</Tooltip>
		</span>
	);
}