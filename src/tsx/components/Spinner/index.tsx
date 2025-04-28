import { type HTMLAttributes } from 'react';
import './style.scss';

function Spinner(props: HTMLAttributes<HTMLElement>): React.JSX.Element {
	return (
		<div className={`_Spinner ${props.className ?? ''}`} />
	);
}

export default Spinner;