/**
 * 'in' indicates the element is being brought into view.
 * 'out' indicates the element is leaving the view.
 * 'idle' indicates that no special transition should be rendered.
 */
type TransitionState = 'in' | 'out' | 'idle';
export default TransitionState;