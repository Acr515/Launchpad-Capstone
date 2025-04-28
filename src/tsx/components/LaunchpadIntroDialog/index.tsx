import DialogBox, { IBaseDialogBoxRef, TRANSITION_TIME } from '../DialogBox';
import { type HTMLAttributes, forwardRef, useImperativeHandle, useRef } from 'react';
import IDialogBoxRef from 'ts/types/IDialogRef';
import Image from '../Image';
import SecondaryButton from '../SecondaryButton';
import images from 'assets/images';
import usePagination from 'ts/hooks/usePagination';
import './style.scss';

const TOTAL_PAGES = 4;

function LaunchpadIntroDialog(_: HTMLAttributes<HTMLElement>, ref: React.Ref<IDialogBoxRef | null>) {
	const dialogRef = useRef<IBaseDialogBoxRef>(null);
	const pages = usePagination(TOTAL_PAGES);

	useImperativeHandle(ref, () => ({
		show: () => {
			dialogRef.current?.show();
			dialogRef.current?.setHideCallback(() => pages.set(0));
		},
		hide: (callback?: () => void) => {
			dialogRef.current?.hide();
			if (typeof callback !== 'undefined') { setTimeout(callback, TRANSITION_TIME); }
		},
		isOpen: dialogRef.current?.isOpen ?? false,
	}));

	return (
		<DialogBox
			ref={dialogRef}
			heading='What is Launchpad?'
			className='_LaunchpadIntroDialog'
		>
			<div className='dialog-content'>
				<div className='dialog-body'>
					<Slide activeIndex={pages.value} index={0}>
						<div className='text-container'>
							<p><strong>Launchpad</strong> is designed to guide FIRST Robotics Competition teams through the <strong>robot software setup process</strong> at the beginning of each build season.</p>
							<p>Tasks that need to be completed are broken up into <strong>modules</strong>, represented with colored bubbles.</p>
						</div>
						<div className='graphic-container'>
							<Image
								className='graphic'
								image={images.graphics.onboard1}
							/>
						</div>
					</Slide>
					<Slide activeIndex={pages.value} index={1}>
						<div className='text-container'>
							<p>Each module contains a few <strong>tasks</strong> that need to be completed before your first competition.</p>
							<p>You can complete tasks in nearly any order, but be sure to complete any <strong>prerequisite tasks</strong> that might be listed.</p>
						</div>
						<div className='graphic-container'>
							<Image
								className='graphic'
								image={images.graphics.onboard2}
							/>
						</div>
					</Slide>
					<Slide activeIndex={pages.value} index={2}>
						<div className='text-container'>
							<p>Each task is made up of a series of <strong>steps</strong>. Use the steps as an instruction guide to lead your team as you work on your robot.</p>
						</div>
						<div className='graphic-container'>
							<Image
								className='graphic'
								image={images.graphics.onboard3}
							/>
						</div>
					</Slide>
					<Slide activeIndex={pages.value} index={3}>
						<div className='text-container'>
							<p>Launchpad includes a <strong>checklist</strong> that you can print off and hang in your build space. Check off the tasks you've completed as your team goes along.</p>
							<p>When all tasks have been completed, your robot will be driveable!</p>
						</div>
						<div className='graphic-container'>
							<Image
								className='graphic'
								image={images.graphics.onboard4}
							/>
						</div>
					</Slide>
				</div>
				<div className='footer-buttons'>
					<SecondaryButton
						label='Previous'
						action={pages.previous}
						active={pages.value > 0}
						image={images.icons.blockArrow}
						iconRotation={180}
						flipIconContainer
					/>
					<SecondaryButton
						label='Next'
						action={pages.next}
						active={pages.value < TOTAL_PAGES - 1}
						image={images.icons.blockArrow}
					/>
				</div>
			</div>
		</DialogBox>
	);
}

export default forwardRef(LaunchpadIntroDialog);

interface ISlideProps extends React.PropsWithChildren {
	index: number;
	activeIndex: number;
}

interface ICSSVariables extends React.CSSProperties {
	'--current-delta': string;
}

/** A single slide in the dialog. This component encapsulates logic for transitioning the slide in and out. */
function Slide(props: ISlideProps) {
	const cssVariables: ICSSVariables = {
		'--current-delta': `${props.activeIndex - props.index}`,
	};

	return (
		<div className={`dialog-slide ${props.activeIndex === props.index ? 'active' : ''}`} style={cssVariables}>
			{props.children}
		</div>
	);
}