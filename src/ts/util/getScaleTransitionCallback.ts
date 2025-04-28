/**
 * For use with the useRoutingTransition hook, generates a callback function that transforms
 * an element to fit the rectangle of another element.
 * @param startRect The DOM rectangle to conform to.
 * @returns A callback function for use with `useRoutingTransition` that returns a
 * CSS properties object with a transform rule.
 */
export default function getScaleTransitionCallback(startRect?: DOMRect): (element: HTMLElement | null) => React.CSSProperties | undefined {
	return (element: HTMLElement | null) => {
		if (typeof startRect === 'undefined' || element === null) { return; }
		const targetHeaderRect = element.getBoundingClientRect();

		const scale = startRect.height / targetHeaderRect.height;
		const x = (startRect.x + startRect.width / 2) - (targetHeaderRect.x + targetHeaderRect.width / 2);
		const y = (startRect.y + startRect.height / 2) - (targetHeaderRect.y + targetHeaderRect.height / 2);
		const transform = `translate(${x}px, ${y}px) scale(${scale})`;
		return { transform: transform };
	};
}