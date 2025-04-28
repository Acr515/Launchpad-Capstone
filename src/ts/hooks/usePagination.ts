import { useState } from 'react';

/**
 * Numerical index hook that tracks a single number and provides built-in bounds-checking.
 * @param total The total number of pages.
 * @returns An object that can be used to get and set the page number.
 */
const usePagination = (total: number) => {
	const [page, setPage] = useState(0);

	return {
		value: page,
		set: (target: number) => {
			if (target > total - 1 || target < 0) { return; }
			setPage(target);
		},
		next: () => {
			if (page >= total - 1) { return; }
			setPage(page + 1);
		},
		previous: () => {
			if (page <= 0) { return; }
			setPage(page - 1);
		},
	};
};

export default usePagination;