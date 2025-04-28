import { type ChangeEvent, type HTMLAttributes, forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import DialogBox from '../DialogBox';
import IDialogBoxRef from 'ts/types/IDialogRef';
import Switch from '../Switch';
import './style.scss';

function SettingsDialog(_: HTMLAttributes<HTMLElement>, ref: React.Ref<IDialogBoxRef | null>): React.JSX.Element {
	const application = useContext(ApplicationContext);
	const dialogRef = useRef<IDialogBoxRef>(null);

	useImperativeHandle(ref, () => ({
		show: () => {
			dialogRef.current?.show();
		},
		hide: () => {
			dialogRef.current?.hide();
		},
		isOpen: dialogRef.current?.isOpen ?? false,
	}));

	const onStarSwitch = (event: ChangeEvent<HTMLInputElement>) => {
		application?.updateSettings({ useStars: event.currentTarget.checked });
	};

	return (
		<DialogBox className='_SettingsDialog' heading='Settings' ref={dialogRef}>
			<div className='content'>
				<div className='setting-row'>
					<div className='setting-label-container'>
						<div className='setting-name'>Show Stars</div>
						<p>While we all love star-gazing, the background stars may degrade your experience.</p>
					</div>
					<Switch className='setting-switch' onChange={onStarSwitch} defaultChecked={!!application?.settings.useStars} />
				</div>
			</div>
		</DialogBox>
	);
}

export default forwardRef(SettingsDialog);