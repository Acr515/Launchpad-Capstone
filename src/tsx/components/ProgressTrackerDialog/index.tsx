import DialogBox, { IBaseDialogBoxRef, TRANSITION_TIME } from '../DialogBox';
import { type HTMLAttributes, forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Button from '../Button';
import type IDialogBoxRef from 'ts/types/IDialogRef';
import images from 'assets/images';
import './style.scss';

function ProgressTrackerDialog(_: HTMLAttributes<HTMLElement>, ref: React.Ref<IDialogBoxRef | null>) {
	const application = useContext(ApplicationContext);
	const dialogRef = useRef<IBaseDialogBoxRef>(null);

	useImperativeHandle(ref, () => ({
		show: () => {
			dialogRef.current?.show();
		},
		hide: (callback?: () => void) => {
			dialogRef.current?.hide();
			if (typeof callback !== 'undefined') { setTimeout(callback, TRANSITION_TIME); }
		},
		isOpen: dialogRef.current?.isOpen ?? false,
	}));

	if (application === null) { return <></>; }

	return (
		<DialogBox
			ref={dialogRef}
			heading='Progress Tracking'
			className='_ProgressTrackerDialog'
		>
			<div className='dialog-content'>
				<div className='content-section'>
					<p>Download and print the Progress Tracker document and hang it in your workspace to keep everyone on your team informed on what tasks have been completed!</p>
					<Button
						className='download-button'
						label='Open'
						action={() => window.open(`${application.config.metadata.files}/Launchpad_ProgressTracker.pdf`, '_blank')?.focus()}
						image={images.icons.link}
						lockMessageInDemo
					/>
				</div>
				<div className='content-section'>
					<div className='tracker-graphic' style={{ backgroundImage: `url('${images.graphics.progressTrackerThumbnail}')` }} />
				</div>
			</div>
		</DialogBox>
	);
}

export default forwardRef(ProgressTrackerDialog);