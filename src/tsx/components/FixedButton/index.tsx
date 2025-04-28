import { HTMLAttributes, useContext, useEffect, useState } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Image from '../Image';
import Tooltip from '../Tooltip';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLButtonElement> {
	/** Hides the button, except for when the active screen is on this list. Defining this list overrides any `inactiveUrl` settings. */
	activeUrls?: string[];
	/** Hides the button on all screens *except* for those on this list. */
	inactiveUrls?: string[];
	/** The icon image to use. */
	image: string;
	/** The label to show on hover. */
	label: string;
	/** The function to run on click. */
	action?: () => void;
}

/**
 * Renders a single icon with hover effects that is visible depending on the current url.
 */
function FixedButton(props: IProps) {
	const [active, setActive] = useState(false);
	const application = useContext(ApplicationContext);

	// Check for url changes
	useEffect(() => {
		let active = false;
		if (typeof application?.router.screenUrl === 'undefined') { return; }
		if (typeof props.activeUrls !== 'undefined') {
			active = props.activeUrls.includes(application.router.screenUrl) || props.activeUrls.includes('');
		} else if (typeof props.inactiveUrls !== 'undefined') {
			active = !props.inactiveUrls.includes(application.router.screenUrl);
		}
		setActive(active);
	}, [application?.router.screenUrl, props.activeUrls, props.inactiveUrls]);

	return (
		<div className={`_FixedButton ${active ? 'active' : ''} ${props.className ?? ''}`} style={props.style}>
			<button
				onClick={props.action}
				className='button'
				disabled={!active}
			>
				<div className='button-icon-wrapper'>
					<Image
						className='button-icon'
						image={props.image}
						icon
						manageColor={false}
					/>
				</div>
			</button>
			<Tooltip
				direction='left'
				flip
				className='button-tooltip'
			>
				<span className='tooltip-label'>{props.label}</span>
			</Tooltip>
		</div>
	);
}

export default FixedButton;