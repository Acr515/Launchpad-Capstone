import { forwardRef, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Loading from 'tsx/screens/Loading';

type RenderState =
	'loading' |
	'loadingFinished' |
	'ready' |
	'animating';

export interface IOutletRef {
	/** Signals to the outlet that it can begin rendering screens. */
	prepare: () => void;
}

/**
 * Outlet renders screen components based on the app state. It may display multiple screens in the stack at the same time
 * to show a transition.
 */
function Outlet(_: unknown, ref: React.Ref<IOutletRef | null>): React.JSX.Element {
	const application = useContext(ApplicationContext);
	const [applicationReady, setApplicationReady] = useState(false);
	const [animationTimeout, setAnimationTimeout] = useState<NodeJS.Timeout | null>(null);
	const renderStateRef = useRef<RenderState>('loading');

	useImperativeHandle(ref, () => ({
		prepare: () => {
			if (applicationReady) { return; }
			renderStateRef.current = 'loadingFinished';
			setApplicationReady(true);
			setAnimationTimer(1000);
			application!.stars!.updateOpacity(0.75);
		},
	}));

	const setAnimationTimer = (time: number) => {
		if (animationTimeout !== null || application === null) { return; }
		setAnimationTimeout(setTimeout(() => {
			// Transition has ended
			setAnimationTimeout(null);
			renderStateRef.current = 'ready';
		}, time));
	};

	// Listen for rerouting
	useLayoutEffect(() => {
		// Defaulting to animate every transition for now
		// TODO: This is an unstable way of handling animations
		renderStateRef.current = 'animating';
		setAnimationTimer(1000);
		// Disabling because eslint wants setAnimationTimer as a dependency, which would be circular
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [application?.router.stackIndex, application?.router.previousStackIndex]);

	// Attach stars
	useEffect(() => {
		if (!applicationReady || application === null || application.stars === null || application.stars.canvas === null) { return; }
		if (application.settings.useStars) {
			application.stars.attach();
		} else {
			application.stars.detach();
		}
	}, [application, application?.stars?.canvas, applicationReady, application?.settings.useStars]);

	// Check if application is loading and abort
	if (application === null) { return <Loading />; }

	const stackIndex = application.router.stackIndex;
	const previousStackIndex = application.router.previousStackIndex;

	const renderMapFunction = (url: string, index: number) => {
		// Decide which screens within the stack to render
		if (index !== stackIndex && index !== previousStackIndex) { return null; }
		if (renderStateRef.current === 'ready' && index === previousStackIndex) { return null; }

		const ScreenComponent = application.router.getScreen(index);
		if (ScreenComponent === null) { return null; }
		const transitionState = renderStateRef.current === 'ready' ? 'idle' : (index === stackIndex ? 'in' : 'out');
		const isLateral = application.router.screenStack[stackIndex] === application.router.screenStack[previousStackIndex];
		const screenType = isLateral ? 'lateral' : (index === stackIndex ? 'current' : 'previous');

		return <ScreenComponent
			key={!isLateral ? url : `${url}-${index}`}
			{...application.router.screenProps[index]}
			transition={{
				transitionState,
				screenType,
			}}
		/>;
	};

	return (
		<>
			{
				(!applicationReady || renderStateRef.current === 'loading' || renderStateRef.current === 'loadingFinished') && (
					<Loading loadingFinished={renderStateRef.current === 'loadingFinished'} />
				)
			}
			{
				application.router.screenStack.map(renderMapFunction)
			}
		</>
	);
}

export default forwardRef(Outlet);