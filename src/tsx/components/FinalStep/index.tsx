import { type HTMLAttributes, type PropsWithChildren, useContext } from 'react';
import { type ModuleConfig, type TaskConfig } from 'ts/types/ModuleData';
import Button from '../Button';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import TaskBubble from '../TaskBubble';
import Tooltip from '../Tooltip';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	next: {
		task: TaskConfig;
		mod: ModuleConfig;
	} | null;
}

/**
 * The final step of a task, which renders the element's children sandwiched
 * between a completion message and a cue to proceed to the next task.
 */
export default function FinalStep(props: IProps): React.JSX.Element {
	const colors = useContext(ColorSchemeContext);

	// TODO: Lateral navigation as inferred by the button here is not possible. Unavailability state is immutable currently- would need to implement this feature first.

	return (
		<div className="_FinalStep">
			<div className='completion-heading'>
				<h2 className='heading-text'>Complete!</h2>
			</div>
			{props.children}
			{ (props.next !== null) && (
				<div className='next-task-container'>
					<div className='bubble-column'>
						<TaskBubble mod={props.next.mod} task={props.next.task} size='large' />
					</div>
					<div className='text-column'>
						<span className='up-next-label'>Up Next:</span>
						<h3 className='next-task-name'>{props.next.task.title}</h3>
					</div>
					<div className='button-column'>
						<Button
							action={() => {}}
							label='Go'
							{...colors}
							className='go-button'
							disabled
						/>
						<Tooltip className='task-unavailable-tooltip' flip>
							<p className='tooltip-text'>This task does not exist in this demo. Browse around to find other tasks!</p>
						</Tooltip>
					</div>
				</div>
			)}
		</div>
	);
}