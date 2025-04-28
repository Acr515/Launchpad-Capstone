import DialogBox, { IBaseDialogBoxRef, TRANSITION_TIME } from '../DialogBox';
import { type HTMLAttributes, forwardRef, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Button from '../Button';
import type IDialogBoxRef from 'ts/types/IDialogRef';
import Image from '../Image';
import ModuleBubble from '../ModuleBubble';
import images from 'assets/images';
import usePagination from 'ts/hooks/usePagination';
import './style.scss';

type HelpIconName = keyof typeof images.help.icons & keyof typeof images.help.screenshots;

interface ICSSVariables extends React.CSSProperties {
	'--current': string;
}

interface IProps extends HTMLAttributes<HTMLElement> {
	showIntroDialog?: () => void;
}

function HelpDialog(props: IProps, ref: React.Ref<IDialogBoxRef | null>) {
	const application = useContext(ApplicationContext);
	const dialogRef = useRef<IBaseDialogBoxRef>(null);
	const pages = usePagination(application?.config.help.length ?? 0);

	useEffect(() => {
		const reset = () => pages.set(0);
		dialogRef.current?.setHideCallback(reset);
	}, [pages, dialogRef.current?.isOpen]);

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

	const showIntroDialog = () => {
		dialogRef.current?.hide();
		if (typeof props.showIntroDialog === 'undefined') { return; }
		props.showIntroDialog();
	};

	const cssVariables: ICSSVariables = {
		'--current': `${pages.value}`,
	};

	return (
		<DialogBox
			ref={dialogRef}
			heading='Help'
			className='_HelpDialog'
			scrollable
		>
			<div className='dialog-content'>
				<div className='intro-region'>
					<h2>What is Launchpad?</h2>
					<div className='third-split'>
						<div className='large-area'>
							<p>Not sure where to start? Click the button to the right if you'd like help learning what Launchpad is and how to use it.</p>
						</div>
						<div className='small-area'>
							<Button
								className='action-button'
								label='Tutorial'
								action={showIntroDialog}
							/>
						</div>
					</div>
					<div className='divider'/>
					<h2>Having robot problems?</h2>
					<div className='third-split'>
						<div className='large-area'>
							<p>If you're having trouble setting up your robot, read on! FRC has a vast network of participants who can help you. <strong>Click an icon below</strong> to read more about some community-based resources.</p>
						</div>
						<div className='small-area'></div>
					</div>
				</div>
				<div className='resource-buttons'>
					<ModuleBubble
						style={cssVariables}
						className='active-indicator'
						primaryColor='#fff'
						secondaryColor='#bbb'
					/>
					{ application.config.help.map((slide, index) => (
						<button className='resource-button' type='button' onClick={() => pages.set(index)} key={slide.heading}>
							<Image className='resource-icon' image={images.help.icons[slide.icon as HelpIconName]} />
						</button>
					))}
				</div>
				<div className='slide-container'>
					{ application.config.help.map((slide, index) => (
						<Slide activeIndex={pages.value} index={index} key={slide.heading}>
							<h3>{slide.heading}</h3>
							<div className='third-split'>
								<div className='large-area resource-description'>
									<div>
										<p>{slide.text}</p>
									</div>
									<div>
										<Image className='resource-screenshot' image={images.help.screenshots[slide.icon as HelpIconName]} />
									</div>
								</div>
								<div className='small-area'>
									<Button
										className='action-button'
										label='Go'
										action={() => window.open(slide.link, '_blank')?.focus()}
										image={images.icons.link}
										lockMessageInDemo
									/>
								</div>
							</div>
						</Slide>
					))}
				</div>
			</div>
		</DialogBox>
	);
}

export default forwardRef(HelpDialog);

interface ISlideProps extends React.PropsWithChildren {
	index: number;
	activeIndex: number;
}

interface ISlideCSSVariables extends React.CSSProperties {
	'--current-delta': string;
}

/** A single slide in the dialog. This component encapsulates logic for transitioning the slide in and out. */
function Slide(props: ISlideProps) {
	const cssVariables: ISlideCSSVariables = {
		'--current-delta': `${props.activeIndex - props.index}`,
	};

	return (
		<div className={`dialog-slide ${props.activeIndex === props.index ? 'active' : ''}`} style={cssVariables}>
			{props.children}
		</div>
	);
}