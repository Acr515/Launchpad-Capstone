/**
 * A `DialogBox` ref with select functionality exposed in order for components to interface with it.
 */
export default interface IDialogBoxRef {
	/** Reveals the dialog. */
	show: () => void;
	/** Hides the dialog. Optionally, a callback can be specified to execute once the dialog has hidden. */
	hide: (callback?: () => void) => void;
	/** Whether this dialog is open or not. */
	isOpen: boolean;
}