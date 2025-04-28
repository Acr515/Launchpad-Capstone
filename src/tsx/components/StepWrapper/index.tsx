import { type HTMLAttributes, type LegacyRef, type PropsWithChildren, memo, useContext } from 'react';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import SubsectionIndicator from '../SubsectionIndicator';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	/** The step's number within the task. */
	index: number;
	/** True if this is the last step, which affects its visual appearance. */
	isFinal: boolean;
	/** The text to display if this step is a subheading. */
	subheading: string | null;
	/** The ref to assign this element to, which is forwarded to `TaskStepInterface`. */
	stepRef: LegacyRef<HTMLDivElement>;
	/** Whether this step is active. */
	isActive: boolean;
	/** Whether to hide all UI displayed by the wrapper. */
	hideStepNumber: boolean;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
	'--neutral-color': string;
	'--neutral-color-inverted': string;
}

/**
 * Boilerplate for every step, rendering the step's number onto the screen and setting up its children.
 */
function StepWrapper(props: IProps): React.JSX.Element {
	const colors = useContext(ColorSchemeContext);

	const cssVariables: ICSSVariables = {
		'--primary-color': colors.primaryColor,
		'--secondary-color': colors.secondaryColor,
		'--neutral-color': colors.neutralColor === 'black' ? 'var(--col-base-dark)' : 'var(--col-base-text)',
		'--neutral-color-inverted': colors.neutralColor === 'black' ? 'var(--col-base-text)' : 'var(--col-base-dark)',
	};

	return (
		<div className={`_StepWrapper ${props.isActive ? 'active' : ''}`} style={cssVariables} ref={props.stepRef}>
			{ !props.hideStepNumber && (
				<div className='step-number'>
					<span className='step-number-character'>{props.index + 1}</span>
				</div>
			)}
			{ props.subheading !== null && (
				<div className='step-subheading-container'>
					<SubsectionIndicator
						active={props.isActive}
					/>
					<h2 className='step-subheading'>{props.subheading}</h2>
				</div>
			)}
			{props.children}
		</div>
	);
}

export default memo(StepWrapper);