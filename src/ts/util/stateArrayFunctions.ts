import SafeAny from 'ts/types/SafeAny';
import StateObject from 'ts/types/StateObject';

/**
 * Removes the last entry of a React state array, invoking the state setter.
 * @param arrayStateObject The state object to mutate.
 * @returns The removed entry.
 */
export function popStateArray(arrayStateObject: StateObject<Array<SafeAny>>): SafeAny {
	const { value, set } = arrayStateObject;
	const array = [...value];
	const poppedValue = array.pop();
	set(array);
	return poppedValue;
}

/**
 * Removes entries from a React state array, invoking the state setter.
 * @param arrayStateObject The state object to mutate.
 * @param start The index from which to start deleting entries.
 * @param deleteCount The number of entries to delete.
 * @param append Optional. Appends an array of entries to the end of the array. If omitted, adds no entries.
 * @returns The removed entry.
 */
export function spliceStateArray(arrayStateObject: StateObject<Array<SafeAny>>, start: number, deleteCount: number, append: Array<SafeAny> | null = null): Array<SafeAny> {
	const { value, set } = arrayStateObject;
	const array = [...value];
	array.splice(start, deleteCount);
	if (append !== null) {
		array.push(...append);
	}
	set(array);
	return array;
}

/**
 * Pushes a new entry to a React state array, invoking the state setter.
 * @param arrayStateObject The state object to mutate.
 * @param val The value to push.
 * @returns The new array.
 */
export function pushStateArray(arrayStateObject: StateObject<Array<SafeAny>>, val: SafeAny): Array<SafeAny> {
	const { value, set } = arrayStateObject;
	const array = [...value];
	array.push(val);
	set(array);
	return array;
}