import { CSSProperties, HTMLAttributes, type PropsWithChildren, useLayoutEffect, useRef } from 'react';
import Tooltip from '../Tooltip';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	/** This step's index within the task. */
	stepNumber: number;
	/** A ref to the step wrapper belonging to this step. */
	stepRef: React.RefObject<HTMLDivElement>;
	/** The method used to scroll to this step on click. */
	scrollFunction: (index: number) => void;
	/** On hover, a tooltip will appear, which reads "Jump to x", where x is the value of this attribute */
	tooltipLabel: string;
	/** Whether or not this marker can be hovered over to show a tooltip. */
	interactive: boolean;
}

interface ICSSVariables extends CSSProperties {
	'--y': string;
}

function ProgressBarMarker(props: IProps) {
	const ready = useRef(false);
	const stepOffset = useRef(0);
	const progressBarOffset = useRef(0);
	const onClick = () => {
		if (!props.interactive) { return; }
		props.scrollFunction(props.stepNumber);
	};

	useLayoutEffect(() => {
		const stepElement = props.stepRef.current;
		if (!ready.current && stepElement !== null) {
			ready.current = true;
			stepOffset.current = stepElement.offsetTop;
			progressBarOffset.current = Math.min(1, ((stepElement.offsetTop) / (stepElement.parentElement!.scrollHeight - stepElement.parentElement!.clientHeight)));
		}
	}, [props.stepRef, ready, props.stepRef.current?.offsetTop]);

	const cssVariables: ICSSVariables = {
		'--y': `${progressBarOffset.current}`,
	};

	return (
		<div
			className={`_ProgressBarMarker ${props.className ?? ''} ${props.interactive ? 'interactive' : ''}`}
			style={cssVariables}
			onClick={onClick}
		>
			{props.children}
			<Tooltip className='marker-tooltip'>
				<span className='jump-to-label'>Jump to</span>
				<h3 className='jump-to-section-name'>{props.tooltipLabel}</h3>
			</Tooltip>
		</div>
	);
}

export default ProgressBarMarker;