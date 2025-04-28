import { useEffect, useRef } from 'react';

/**
 * Custom React hook that executes an effect on each new animation frame. Use sparingly.
 * Derived from: https://css-tricks.com/using-requestanimationframe-with-react-hooks/
 * @param callback A callback to execute on each new animation frame. Provides the delta time.
 * @param dependencyArray Effect dependencies. Should contain any state variables that need to change
 * during the animation.
 */
const useAnimationFrame = (callback: (deltaTime: number) => void): void => {
	const requestRef = useRef<number>();
	const previousTimeRef = useRef<number>();

	const animate = (time: number) => {
		if (previousTimeRef.current != undefined) {
			const deltaTime = time - previousTimeRef.current;
			callback(deltaTime);
		}
		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		if (typeof requestRef.current !== 'undefined') { return () => cancelAnimationFrame(requestRef.current!); }
	});
};

export default useAnimationFrame;