import type { ModuleConfig, TaskConfig } from 'ts/types/ModuleData';
import React, { HTMLAttributes, useContext } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import getTaskCode from 'ts/util/getTaskCode';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	/** The task to display. */
	task: TaskConfig;
	/** The module to which this task belongs. Used to configure color. */
	mod: ModuleConfig;
	/** Either 'small' or 'large', which changes the size and font weight of the bubble. */
	size: 'small' | 'large';
	/** Ref for this component. */
	myRef?: React.RefObject<HTMLDivElement>;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
}

/**
 * A bubble containing the human-readable numerical code of a task.
 */
export default function TaskBubble(props: IProps): React.JSX.Element {
	const application = useContext(ApplicationContext);
	const taskNumber = application === null ? '?' : getTaskCode(props.task.id, application.config);

	const cssVariables: ICSSVariables = {
		...props.style,
		'--primary-color': props.mod.primaryColor,
		'--secondary-color': props.mod.secondaryColor,
	};

	return (
		<div
			ref={props.myRef}
			className={`_TaskBubble ${props.className ?? ''} ${props.size}`}
			style={cssVariables}
			onClick={props.onClick}
		>
			<div className='bubble-content-wrapper'>
				{ props.size === 'large' && <span className='task-number'>{taskNumber}</span> }
			</div>
		</div>
	);
}