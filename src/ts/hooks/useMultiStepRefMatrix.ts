import { createRef, useRef } from 'react';
import MultiStepMarkerPairs from 'ts/types/MultiStepMarkerPairs';

/**
 * Generates an array of `MultiStepMarkerPairs` objects.
 * @param lengths One entry for each multistep step in the task, with each number representing the
 * number of steps within the set.
 * @returns A ref object containing a matrix of the marker ref pairs to be implemented in the task.
 */
export default function useMultiStepRefMatrix(lengths: number[]): React.MutableRefObject<MultiStepMarkerPairs[] | null> {
	const matrix = useRef<MultiStepMarkerPairs[] | null>(null);

	if (matrix.current === null) {
		matrix.current = lengths.map((length) => {
			return {
				inline: Array.from({ length }, () => createRef<HTMLDivElement>()),
				image: Array.from({ length }, () => createRef<HTMLDivElement>()),
			};
		});
	}

	return matrix;
}