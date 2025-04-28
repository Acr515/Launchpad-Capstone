import DialogBox, { IBaseDialogBoxRef } from '../DialogBox';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import type Application from 'ts/classes/Application';
import ApplicationContext from 'ts/context/ApplicationContext';
import Background from '../Background';
import Breadcrumbs from '../Breadcrumbs';
import Button from '../Button';
import DemoIdleDialog from '../DemoIdleDialog';
import FixedButton from '../FixedButton';
import HelpDialog from '../HelpDialog';
import type IDialogBoxRef from 'ts/types/IDialogRef';
import LaunchpadIntroDialog from '../LaunchpadIntroDialog';
import ProgressTrackerDialog from '../ProgressTrackerDialog';
import images from 'assets/images';
import useStarryCanvas from 'ts/hooks/useStarryCanvas';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	application: Application;
}


/**
 * The frame component is a part of the foundation of the web-app. It wraps all components with necessary contexts.
 * It is implemented once under the App component.
 */
export default function Frame({ application, children }: IProps): React.JSX.Element {
	const [starState, setStarState] = useState(true);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const starryBackground = useStarryCanvas(canvasRef.current);
	const helpDialog = useRef<IDialogBoxRef>(null);
	const introDialog = useRef<IDialogBoxRef>(null);
	const progressDialog = useRef<IDialogBoxRef>(null);
	const [devInterfaceVisible, setDevInterfaceVisible] = useState(false);
	const [portraitWarningViewed, setPortraitWarningViewed] = useState(false);
	const portraitDialogRef = useRef<IBaseDialogBoxRef>(null);
	const mobileMediaQuery = useRef(window.matchMedia('(max-width: 1200px) and (max-aspect-ratio: 5/4)'));
	application.registerFrameState({
		stars: starryBackground,
	});

	// Adding event to listen for F1 key to toggle development debugger
	useEffect(() => {
		const onDevKeyPressed = (event: KeyboardEvent): void => {
			if (event.key === 'F1') {
				setDevInterfaceVisible(!devInterfaceVisible);
			}
		};
		if (!application.production) { document.addEventListener('keydown', onDevKeyPressed); }

		return () => {
			document.removeEventListener('keydown', onDevKeyPressed);
		};
	}, [devInterfaceVisible, application.production]);

	// Listen for media query activation
	useEffect(() => {
		if (portraitWarningViewed) { return; }
		portraitDialogRef.current?.setHideCallback(() => setPortraitWarningViewed(true));
		const mq = mobileMediaQuery.current;

		const handleMediaQuery = (event: MediaQueryListEvent) => {
			if (portraitWarningViewed || !event.matches) { return; }
			portraitDialogRef.current?.show();
		};


		if (mq.matches) {
			setTimeout(() => portraitDialogRef.current?.show(), 2000);
		} else {
			mq.addEventListener('change', handleMediaQuery);
		}

		return () => {
			mq.removeEventListener('change', handleMediaQuery);
		};
	}, [portraitWarningViewed]);

	const dismissPortraitWarning = () => {
		portraitDialogRef.current?.hide();
		setPortraitWarningViewed(true);
	};

	const toggleStars = () => {
		if (!starState) {
			starryBackground.attach();
			setStarState(true);
		} else {
			starryBackground.detach();
			setStarState(false);
		}
	};

	return (
		<ApplicationContext.Provider value={application}>
			<div className='_Frame'>
				{ (!application.production && devInterfaceVisible) && (
					<div className='dev'>
						<Breadcrumbs />
						<button onClick={toggleStars}>Toggle Stars</button>
					</div>
				)}
				{children}
				<div className='fixed-button-container'>
					<FixedButton
						activeUrls={['modules']}
						image={images.icons.clipboard}
						label='Progress Tracking'
						style={{ zIndex: 2 }}
						action={progressDialog.current?.show}
					/>
					<FixedButton
						inactiveUrls={['/']}
						image={images.icons.question}
						label='Get Help'
						style={{ zIndex: 3 }}
						action={helpDialog.current?.show}
					/>
				</div>
				<HelpDialog ref={helpDialog} showIntroDialog={introDialog.current?.show} />
				<LaunchpadIntroDialog ref={introDialog} />
				<ProgressTrackerDialog ref={progressDialog} />
				<div className='background-container'>
					<Background backgroundType='welcome' mod={null} />
					<Background backgroundType='neutral' mod={null} />
					{
						application.config.modules.map((mod) => {
							return (
								<Background backgroundType='module' mod={mod} key={mod.id} />
							);
						})
					}
				</div>
				<canvas className='canvas' ref={canvasRef}></canvas>
				<DialogBox className='portrait-warning-dialog' ref={portraitDialogRef}>
					<div className='warning-content'>
						<p>It looks like you're using a phone or an otherwise narrow window. <strong>This site is not</strong> (yet) <strong>responsively designed</strong>, so your experience will be sub-optimal.</p>
						<p>This site looks best on a <strong>computer or laptop</strong>.</p>
						<div className='warning-graphic-container'>
							<div className='warning-graphic-parent'>
								<div className='warning-graphic-ghost' />
							</div>
						</div>
						<Button className='warning-exit-button' label='Understood' action={dismissPortraitWarning} />
					</div>
				</DialogBox>
				{ application.config.metadata.demo && <DemoIdleDialog /> }
			</div>
		</ApplicationContext.Provider>
	);
};