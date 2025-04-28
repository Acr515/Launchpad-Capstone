import { HTMLAttributes, useContext } from 'react';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import Image from '../Image';
import SecondaryTooltip from '../SecondaryTooltip';
import images from 'assets/images';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLButtonElement> {
	/** The text label to display. */
	label: string;
	/** An icon to use for the button. If omitted, defaults to `downArrow`. */
	image?: string;
	/** If true, disables hover states and prevents `action()` from executing on click. */
	active?: boolean;
	/** The function to run when the button is clicked. */
	action: () => void;
	/** Optional configuration to show a hover tooltip alluding to the button's behavior in jumping to a later step in a task. */
	jumpConfig?: {
		toEnd?: boolean;
		index: number;
	};
	/** Primary color for button- if omitted, attempts to use `ColorSchemeContext`. */
	primaryColor?: string;
	/** Secondary color for button- if omitted, attempts to use `ColorSchemeContext`. */
	secondaryColor?: string;
	/** Optional. Rotates the icon in degrees. */
	iconRotation?: number;
	/** Optional. If true, moves the icon bubble to the left side of the button. */
	flipIconContainer?: boolean;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
	'--rotation': string;
}

/**
 * Creates a secondary button, akin to the regular button but smaller and less contrast-y.
 */
export default function SecondaryButton(props: IProps): React.JSX.Element {
	const colors = useContext(ColorSchemeContext);
	const image = props.image ?? images.icons.downArrow;
	const active = props.active ?? true;

	const cssVariables: ICSSVariables = {
		...props.style,
		'--primary-color': props.primaryColor ?? colors.primaryColor ?? '#bbb',
		'--secondary-color': props.secondaryColor ?? colors.secondaryColor ?? '#fff',
		'--rotation': `${props.iconRotation ?? 0}`,
	};

	return (
		<button
			className={`_SecondaryButton ${props.className ?? ''} ${active ? '' : 'disabled'}`}
			style={cssVariables}
			type='button'
			onClick={active ? props.action : () => {}}
			disabled={!active}
		>
			{ !props.flipIconContainer && (<span className='label'>{props.label}</span>)}
			<div className='icon-circle-wrapper'>
				<div className='icon-circle'>
					<div className='icon-element'>
						<Image icon image={image} color='#eee' />
					</div>
				</div>
			</div>
			{ props.flipIconContainer && (<span className='label'>{props.label}</span>)}
			{ typeof props.jumpConfig !== 'undefined' && (
				<SecondaryTooltip className='jump-hover-cue' jumpConfig={props.jumpConfig} />
			)}
		</button>
	);
}