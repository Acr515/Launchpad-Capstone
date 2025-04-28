import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactLenis, { LenisRef } from 'lenis/react';
import ApplicationContext from 'ts/context/ApplicationContext';
import type { LenisOptions } from 'lenis';
import type { ModuleConfig } from 'ts/types/ModuleData';
import ModuleListItem from 'tsx/components/ModuleListItem';
import type ScreenProps from 'ts/types/ScreenProps';
import useRoutingTransition from 'ts/hooks/useRoutingTransition';
import './style.scss';

interface ICSSVariables extends React.CSSProperties {
	/** A bubble's order in the stack, which causes the transition to lag behind more or less. */
	'--order'?: string;
}

const options: LenisOptions = {
	duration: 0,
	easing: (t) => 1 - Math.pow(1 - t, 3),
	orientation: 'horizontal',
	gestureOrientation: 'both',
};

/**
 * Screen for showing the user the different available modules.
 * @param props Props passed via the router.
 */
export default function Modules(props: ScreenProps): React.JSX.Element {
	const application = useContext(ApplicationContext);
	const lenisRef = useRef<LenisRef>(null);
	const screenContainerRef = useRef<HTMLDivElement | null>(null);
	const startScroll = useRef<number | null>(null);
	const startIndex = typeof props?.modules === 'undefined' ? 0 : props.modules.currentModule ?? 0;
	const [focusedModule, setFocusedModule] = useState(startIndex);

	// Auto-scroll to a specific area if it's specified
	useLayoutEffect(() => {
		if (lenisRef.current) {
			if (typeof props?.modules?.scrollAmount === 'undefined') { return; }
			lenisRef.current.wrapper!.scrollLeft = props?.modules?.scrollAmount ?? 0;
		}
	}, [props?.modules?.scrollAmount]);

	// Move starry background on scroll
	useEffect(() => {
		const lenis = lenisRef.current;
		if (application === null || lenis === null || lenis.wrapper === null) { return; }

		const onScroll = () => {
			if (props?.transition?.transitionState === 'out') { return; }
			if (application === null || lenis === null || lenis.wrapper === null) { return; }
			if (startScroll.current === null) { startScroll.current = lenis.wrapper.scrollLeft / 2; }
			application?.stars?.move({ x: lenis.wrapper.scrollLeft / 2 - startScroll.current });
		};
		lenis.wrapper.addEventListener('scroll', onScroll);

		return () => {
			lenis.wrapper?.removeEventListener('scroll', onScroll);
		};
	// Disabling because adding application to the dep array would break the effect
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lenisRef.current?.wrapper]);

	// Transition in/out
	const { animationClass } = useRoutingTransition(application?.router?.direction ?? 1, props?.transition?.transitionState, {
		forwardOut: [
			{
				ref: screenContainerRef,
				style: { transform: 'scale(5)', opacity: '0' },
			},
		],
		backwardIn: [
			{
				ref: screenContainerRef,
				style: { transform: 'scale(5)', opacity: '0' },
			},
		],
		forwardIn: [
			{
				ref: screenContainerRef,
				style: { '--x': '1' },
			},
		],
	});

	// Fed to ModuleListItem to give it the ability to set the focused module when scrolled into view
	const updateFocusedModule = useCallback((index: number) => {
		if (focusedModule === index) { return; }
		setFocusedModule(index);
	}, [focusedModule, setFocusedModule]);

	// Map function to create modules
	const populateModules = (mod: ModuleConfig, index: number) => {
		if (application === null) { return null; }
		const cssVariables: ICSSVariables = {
			'--order': `${index / (application.config.modules.length - 1)}`,
		};
		return (
			<div className='module' key={mod.id}>
				<ModuleListItem
					mod={mod}
					index={index}
					className={`module-item ${animationClass}`}
					style={cssVariables}
					isFocused={index === focusedModule}
					updateFocus={updateFocusedModule}
					snapScrollTo={application?.router.direction === -1 && props?.transition?.transitionState === 'in'}
					transitionState={props?.transition?.transitionState ?? 'idle'}
				/>
			</div>
		);
	};

	if (application === null) { return ModulesNull(); }

	return (
		<div className='_Modules _Screen'>
			<div className={`screen-container ${animationClass}`} ref={screenContainerRef}>
				<ReactLenis
					ref={lenisRef}
					options={{ ...options }}
					className='module-container'
				>
					{ application.config.modules.map(populateModules) }
				</ReactLenis>
			</div>
		</div>
	);
};

function ModulesNull(): React.JSX.Element {
	return (
		<div className="_Modules is-null">
			<p>Modules screen failed to render: Application read as null</p>
		</div>
	);
}