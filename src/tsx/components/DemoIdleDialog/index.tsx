import { useContext, useEffect, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import DialogBox from '../DialogBox';
import type IDialogBoxRef from 'ts/types/IDialogRef';
import './style.scss';

interface ICSSVariables extends React.CSSProperties {
	'--idle-transform-time': string;
}

const DEMO_IDLE_TIMEOUT = 40000;
const DEMO_IDLE_WARNING_TIMEOUT = 10000;

function DemoIdleDialog() {
	const application = useContext(ApplicationContext);
	const dialogRef = useRef<IDialogBoxRef>(null);
	const demoMouseInterval = useRef<NodeJS.Timeout | null>(null);

	// Adding event listener for demo timer
	useEffect(() => {
		if (!application?.config.metadata.demo || application.router.screenUrl === '/' || typeof application.router.screenUrl === 'undefined') { return; }
		const demoTimingOut = () => {
			dialogRef.current?.show();
			demoMouseInterval.current = setTimeout(() => { location.reload(); }, DEMO_IDLE_WARNING_TIMEOUT);
		};
		const resetDemoTimer = () => {
			if (demoMouseInterval.current !== null) { clearInterval(demoMouseInterval.current); }
			demoMouseInterval.current = setTimeout(demoTimingOut, DEMO_IDLE_TIMEOUT);
			if (dialogRef.current?.isOpen) { dialogRef.current.hide(); }
		};

		resetDemoTimer();
		window.addEventListener('mousemove', resetDemoTimer);

		return () => {
			window.removeEventListener('mousemove', resetDemoTimer);
		};
	}, [application?.config.metadata.demo, application?.router.screenUrl]);

	const cssVariables: ICSSVariables = {
		'--idle-transform-time': `${DEMO_IDLE_WARNING_TIMEOUT}`,
	};

	return (
		<DialogBox
			className='_DemoIdleDialog'
			heading='Anyone there?'
			ref={dialogRef}
			style={cssVariables}
		>
			<div className='idle-dialog-content'>
				<p>Launchpad will reload in <strong>{DEMO_IDLE_WARNING_TIMEOUT * 0.001} seconds</strong> if there is no activity.</p>
				<div className='idle-dialog-reload-bar'>
					<div className='idle-dialog-reload-bar-fill'/>
				</div>
			</div>
		</DialogBox>
	);
}

export default DemoIdleDialog;