import { type HTMLAttributes, type PropsWithChildren, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type IDialogBoxRef from 'ts/types/IDialogRef';
import Image from '../Image';
import images from 'assets/images';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	/** Optional. Heading text to show at the top of the dialog box. */
	heading?: string;
	/** Optional. Whether or not the dialog is scrollable, which will clip its content and fix its border radius. */
	scrollable?: boolean;
}

interface ICSSVariables extends React.CSSProperties {
	'--transition-time': string;
}

export interface IBaseDialogBoxRef extends IDialogBoxRef {
	/** Specifies a callback function to be executed after the dialog is hidden, regardless of how it is hidden. */
	setHideCallback: (callback?: () => void) => void;
}

/** The time in milliseconds it takes for the dialog to fully disappear. */
export const TRANSITION_TIME = 250;

/**
 * Shows a dialog box that begins hidden to the user and can be revealed
 * by accessing its ref's member functions.
 */
function DialogBox(props: IProps, ref: React.Ref<IDialogBoxRef | null>): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const externalCallbackRef = useRef<() => void | undefined>();

	const show = () => {
		setIsOpen(true);
	};

	const hide = () => {
		const callback = externalCallbackRef.current;
		setIsOpen(false);
		if (typeof callback !== 'undefined') {
			setTimeout(() => { callback(); }, TRANSITION_TIME);
		}
	};

	useImperativeHandle(ref, () => ({
		show,
		hide: (callback?: () => void) => {
			hide();
			if (typeof callback !== 'undefined') { setTimeout(callback, TRANSITION_TIME); }
		},
		isOpen,
		setHideCallback: (callback?: () => void) => {
			externalCallbackRef.current = callback;
		},
	}));

	const cssVariables: ICSSVariables = {
		...props.style,
		'--transition-time': `${TRANSITION_TIME}ms`,
	};

	return (
		<>
			<div className={`_DialogBox ${props.className ?? ''} ${isOpen ? 'opened' : ''} ${props.scrollable ? 'scrollable' : ''}`} style={cssVariables}>
				<div className='box-corner top-left' />
				<div className='box-corner top-right' />
				<div className='box-corner bottom-left' />
				<div className='box-corner bottom-right' />
				<div className='heading-area'>
					{ typeof props.heading !== 'undefined' && (
						<h2 className='dialog-heading'>{props.heading}</h2>
					)}
					<button className='close-button' onClick={hide}>
						<Image className='close-button-icon' image={images.icons.cross} icon manageColor={false} />
					</button>
				</div>
				<div className='content-area'>
					{props.children}
				</div>
			</div>
			<div className='interactivity-blocker' onClick={hide} />
		</>
	);
}

export default forwardRef(DialogBox);