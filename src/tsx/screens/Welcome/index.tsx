import { useContext, useEffect, useRef, useState } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Button from 'tsx/components/Button';
import FixedButton from 'tsx/components/FixedButton';
import type IDialogBoxRef from 'ts/types/IDialogRef';
import Image from 'tsx/components/Image';
import LaunchpadIntroDialog from 'tsx/components/LaunchpadIntroDialog';
import ModuleBubble from 'tsx/components/ModuleBubble';
import type ScreenProps from 'ts/types/ScreenProps';
import SecondaryButton from 'tsx/components/SecondaryButton';
import SettingsDialog from 'tsx/components/SettingsDialog';
import images from 'assets/images';
import './style.scss';

interface ICSSVariables extends React.CSSProperties {
	'--y': string;
	'--z': string;
}

function lerp(start: number, end: number, t: number): number {
	const value = start + (end - start) * t;
	return value;
}

const MOUSE_SNAP_THRESHOLD = 0.1;
const MOUSE_SKEW_FACTOR = -0.2;
const MOUSE_LERP_FACTOR = 0.185;

/**
 * Screen showed on launch, welcoming the user to the web-app.
 */
export default function Welcome(props: ScreenProps): React.JSX.Element {
	const application = useContext(ApplicationContext);
	const effectContainer = useRef<HTMLDivElement>(null);
	const introDialogRef = useRef<IDialogBoxRef>(null);
	const settingsDialogRef = useRef<IDialogBoxRef>(null);

	// For coordinating the entrance/exit animation
	const [mounted, setMounted] = useState(false);
	const [transitioning, setTransitioning] = useState(false);

	// For lerping mouse position
	const [_, setMouse] = useState({ x: 0, y: 0 });
	const [targetMouse, setTargetMouse] = useState({ x: 0, y: 0 });
	const bubbleAnimationRef = useRef(-1);

	/**
	 * Render loop for updating mouse coordinates on bubble components.
	 */
	const updateBubbleCoordinates = () => {
		const element = effectContainer.current;
		if (element === null) { return; }

		setMouse((prevPos) => {
			const coordinates = {
				x: lerp(prevPos.x, targetMouse.x, MOUSE_LERP_FACTOR),
				y: lerp(prevPos.y, targetMouse.y, MOUSE_LERP_FACTOR),
			};

			const rect = element.getBoundingClientRect();
			let styleX = 0.5 - (coordinates.x - rect.left) / rect.width;
			let styleY = 0.5 - (coordinates.y - rect.top) / rect.height;

			styleX += MOUSE_SKEW_FACTOR * styleY;
			styleY += MOUSE_SKEW_FACTOR * styleX;

			element.style.setProperty('--mouse-x', `${styleX}`);
			element.style.setProperty('--mouse-y', `${styleY}`);

			const distance = Math.sqrt((coordinates.x - targetMouse.x) ** 2 + (coordinates.y - targetMouse.y) ** 2);
			if (distance < MOUSE_SNAP_THRESHOLD) {
				cancelAnimationFrame(bubbleAnimationRef.current);
				return targetMouse;
			}

			return coordinates;
		});

		bubbleAnimationRef.current = requestAnimationFrame(updateBubbleCoordinates);
	};

	// Store mounted state
	useEffect(() => {
		if (props?.transition?.transitionState !== 'out') {
			setTimeout(() => {
				setMounted(true);
			}, 500);
		}
	}, [props?.transition?.transitionState]);

	// Attach mouse move listener
	useEffect(() => {
		const element = effectContainer.current;
		if (element === null) { return; }

		const onMouseMove = (e: MouseEvent) => {
			setTargetMouse(({ x: e.clientX, y: e.clientY }));
		};

		element.addEventListener('mousemove', onMouseMove);
		bubbleAnimationRef.current = requestAnimationFrame(updateBubbleCoordinates);

		return () => {
			element.removeEventListener('mousemove', onMouseMove);
			cancelAnimationFrame(bubbleAnimationRef.current);
		};
	});

	if (application === null) { return WelcomeNull(); }

	/**
	 * Waits for a brief period as an animation is played before executing the navigation function
	 */
	const navigateToModules = () => {
		if (application === null || transitioning) { return; }
		setTransitioning(true);
		setTimeout(() => {
			application.router.setScreen({ url: 'modules', props: { modules: { scrollAmount: 0 } } });
		}, 800);
	};

	const showIntroDialog = () => {
		if (introDialogRef.current === null || transitioning) { return; }
		introDialogRef.current.show();
	};

	const showSettingsDialog = () => {
		if (settingsDialogRef.current === null || transitioning) { return; }
		settingsDialogRef.current.show();
	};

	return (
		<div className='_Welcome _Screen'>
			<LaunchpadIntroDialog ref={introDialogRef} />
			<SettingsDialog ref={settingsDialogRef} />
			<div className={`effect-column ${!mounted ? 'inactive' : ''} ${transitioning ? 'leaving' : ''}`} ref={effectContainer}>
				{application.config.modules.map((mod, index) => {
					const percentage = index / (application.config.modules.length - 1);
					const cssVariables: ICSSVariables = {
						'--y': `${percentage}`,
						'--z': `${application.config.modules.length - index}`,
					};
					return (
						<ModuleBubble
							key={mod.id}
							className='effect-bubble'
							primaryColor={mod.primaryColor}
							secondaryColor={mod.secondaryColor}
							style={cssVariables}
						/>
					);
				})}
			</div>
			<div className={`content-column ${!mounted ? 'inactive' : ''} ${transitioning ? 'leaving' : ''}`}>
				<div className='wordmark-container'>
					<Image className='wordmark' image={images.graphics.wordmark} />
				</div>
				<Button className='launch-button' action={navigateToModules} label='Begin' />
				<SecondaryButton className='what-is-this-link' action={showIntroDialog} label='What is this?' image={images.icons.question} primaryColor='#444' />
			</div>
			{ !application.config.metadata.demo && (
				<div className='fixed-button-container'>
					<FixedButton
						inactiveUrls={[]}
						action={showSettingsDialog}
						image={images.icons.gear}
						label='Settings'
						className={`settings-button ${(transitioning || props?.transition?.transitionState === 'out') ? 'leaving' : ''}`}
					/>
				</div>
			)}
		</div>
	);
};

function WelcomeNull(): React.JSX.Element {
	return (
		<div className='_Welcome is-null'>Error: Application wasn't ready yet</div>
	);
}