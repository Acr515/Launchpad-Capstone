import React, { HTMLAttributes, memo, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Button from '../Button';
import Image from '../Image';
import ModuleBubble from '../ModuleBubble';
import type { ModuleConfig } from 'ts/types/ModuleData';
import type TransitionState from 'ts/types/TransitionState';
import images from 'assets/images';
import { useLenis } from 'lenis/react';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	/** The module to display. */
	mod: ModuleConfig;
	/** This module's index. */
	index: number;
	/** Indicates whether this module is selected or not. */
	isFocused: boolean;
	/** Callback function to update the focused module. */
	updateFocus: (index: number) => void;
	/** Whether or not to snap the scroll component directly to this element upon render. */
	snapScrollTo: boolean;
	/** The transition state of the Modules screen. */
	transitionState: TransitionState;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
}

type ScrollDimensionCache = {
	element: number;
	parent: number;
};

function getModuleIcon(index: number, active: boolean): string {
	const type = active ? 'focus' : 'blur';
	const retrievalIndex = typeof images.modules[index] !== 'undefined' ? index : 0;
	return images.modules[retrievalIndex][type];
}

/**
 * A single module bubble as shown on the Modules screen.
 */
function ModuleListItem(props: IProps) {
	const application = useContext(ApplicationContext);
	const baseElementRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLHeadingElement>(null);
	const proportionsRef = useRef<ScrollDimensionCache>({ element: 0, parent: 0 });

	// Check position on screen
	const lenis = useLenis(({ scroll }) => {
		if (props.transitionState !== 'idle') { return; }
		const element = baseElementRef.current;
		if (element === null) { return; }

		const isFocused = Math.abs(proportionsRef.current.element - (scroll + proportionsRef.current.parent * 0.5)) < proportionsRef.current.parent * 0.1;
		if (isFocused) {
			props.updateFocus(props.index);
		}
	}, [props.isFocused, props.transitionState]);

	// On first render, scroll into view
	useLayoutEffect(() => {
		if (props.snapScrollTo && props.isFocused) {
			baseElementRef.current?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
		}
	});

	// Re-cache dimensions on window resize
	useEffect(() => {
		const cacheDimensions = () => {
			if (typeof lenis === 'undefined') { return; }
			const element = baseElementRef.current;
			if (element === null) { return; }
			proportionsRef.current = {
				element: element.offsetLeft + (element.offsetWidth / 2),
				parent: lenis.rootElement.offsetWidth,
			};
		};
		window.addEventListener('resize', cacheDimensions);
		cacheDimensions();
		return () => {
			window.removeEventListener('resize', cacheDimensions);
		};
	}, [lenis, props.isFocused]);

	// Add click listener
	useEffect(() => {
		const element = baseElementRef.current;
		const onClick = () => {
			if (props.isFocused || element === null || typeof lenis === 'undefined') { return; }
			lenis.scrollTo(element, {
				offset: -lenis.dimensions.width / 2 + element.offsetWidth / 2,
				duration: 0.75,
			});
		};
		element?.addEventListener('click', onClick);
		return () => {
			element?.removeEventListener('click', onClick);
		};
	}, [props.isFocused, lenis]);

	// Navigate to view module screen
	const navigate = () => {
		if (application === null || baseElementRef.current === null || typeof lenis?.scroll === 'undefined') { return; }
		if (headerRef.current === null) { return; }
		application.stars?.moveDelta({ z: 0.075 });
		application.router.setScreen({
			url: 'view-module',
			props: {
				viewModule: { mod: props.mod },
				elementRects: {
					header: headerRef.current.getBoundingClientRect(),
				},
			},
			previousProps: {
				modules: {
					currentModule: props.index,
					scrollAmount: lenis?.animatedScroll,
				},
			},
		});
	};

	const cssVariables: ICSSVariables = {
		'--primary-color': props.mod.primaryColor,
		'--secondary-color': props.mod.secondaryColor,
		...props.style,
	};

	return (
		<div
			className={`_ModuleListItem ${props.isFocused ? 'focused' : 'blurred'} ${props.className ?? ''}`}
			style={cssVariables}
			ref={baseElementRef}
		>
			<ModuleBubble
				primaryColor={props.mod.primaryColor}
				secondaryColor={props.mod.secondaryColor}
				className='module-item'
				innerClassName='module-item-inner'
			>
				<div className='icon'>
					<Image image={getModuleIcon(props.index, props.isFocused)} />
				</div>
				<h2 className={`module-title ${props.transitionState === 'out' && props.isFocused ? 'hide' : ''}`} ref={headerRef}>{props.mod.title}</h2>
				<span className='task-count'>{props.mod.tasks.length} Task{props.mod.tasks.length !== 1 && ('s')}</span>
				<div className='view-button-container'>
					<Button
						className='view-button'
						label='View'
						primaryColor={props.mod.primaryColor}
						secondaryColor={props.mod.secondaryColor}
						action={navigate}
					/>
				</div>
			</ModuleBubble>
		</div>
	);
}

export default memo(ModuleListItem);