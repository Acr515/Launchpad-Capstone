import { type HTMLAttributes, cloneElement, useContext, useEffect, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Image from '../Image';
import Spinner from '../Spinner';
import Tooltip from '../Tooltip';
import images from 'assets/images';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLButtonElement> {
	/** The text label to display on the button. */
	label: string;
	/** An icon to use for the button. If omitted, defaults to blockArrow. */
	image?: string;
	/** The primary color of the button. */
	primaryColor?: string;
	/** The secondary color of the button. */
	secondaryColor?: string;
	/** The function to run when the button is clicked. */
	action: () => unknown;
	/** When set to true, replaces the image with a loading spinner. */
	loading?: boolean;
	/** If true, prevents clicking on the button and changes its style. */
	disabled?: boolean;
	/** A tooltip to show on hover. */
	secondaryTooltip?: React.ReactElement<HTMLAttributes<HTMLElement>>;
	/**
	 * When value is provided, button appears as active but is deactivated with the provided tooltip message in demo mode only.
	 * If simply a boolean, shows a generic message.
	 */
	lockMessageInDemo?: string | boolean;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
}

export default function Button(props: IProps): React.JSX.Element {
	const application = useContext(ApplicationContext);
	const image = props.image ?? images.icons.blockArrow;
	const flipTooltip = useRef<boolean | null>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (flipTooltip.current === null && buttonRef.current !== null) {
			flipTooltip.current = buttonRef.current?.getBoundingClientRect().x > innerWidth / 2;
		}
	}, []);

	// Inject classname into secondary tooltip, if it exists
	const secondaryTooltip = typeof props.secondaryTooltip === 'undefined' ? null : cloneElement(props.secondaryTooltip, {
		className: 'secondary-tooltip',
	});

	const onClick = () => {
		if (application?.config.metadata.demo && !!props.lockMessageInDemo) { return; }
		props.action();
	};

	const cssVariables: ICSSVariables = {
		...props.style,
		'--primary-color': props.primaryColor ?? '#eee',
		'--secondary-color': props.secondaryColor ?? '#ccc',
	};

	return (
		<button
			className={`_Button ${props.className ?? ''}`}
			style={cssVariables}
			type='button'
			onClick={onClick}
			disabled={(!!props.lockMessageInDemo && !!application?.config.metadata.demo) || (props.disabled ?? false)}
			ref={buttonRef}
		>
			<span className='label'>{props.label}</span>
			<div className='icon-circle-wrapper'>
				<div className='icon-circle'>
					<div className='icon-element'>
						{ props.loading ? (
							<Spinner className='loading-spinner' />
						) : (
							<Image icon image={image} color='#eee' />
						) }
					</div>
				</div>
			</div>
			{secondaryTooltip}
			{ (application?.config.metadata.demo && !!props.lockMessageInDemo) && (
				<Tooltip className={`demo-lock-tooltip ${flipTooltip.current ? 'flip' : ''}`} flip={flipTooltip.current ?? false}>
					<p className='demo-lock-tooltip-text'>{props.lockMessageInDemo === true ? 'This functionality is disabled in the demo.' : props.lockMessageInDemo}</p>
				</Tooltip>
			)}
		</button>
	);
}