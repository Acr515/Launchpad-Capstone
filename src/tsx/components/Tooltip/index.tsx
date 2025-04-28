import { type HTMLAttributes, type PropsWithChildren } from 'react';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	/** The direction to draw the arrow. Defaults to left. */
	direction?: 'top' | 'left';
	/** A value with CSS units used to position the arrow on the tooltip box. */
	arrowPosition?: string;
	/** Flips the position of the arrow. */
	flip?: boolean;
}

interface ICSSVariables extends React.CSSProperties {
	'--p': string;
}

/**
 * A tooltip to be used in conjunction with hover events to display clarifying information.
 */
export default function Tooltip(props: IProps): React.JSX.Element {
	const cssVariables: ICSSVariables = {
		'--p': `${(props.arrowPosition ?? `50%`)}`,
	};

	return (
		<div className={`_Tooltip ${props.className ?? ''}`}>
			<div className='content'>
				{props.children}
			</div>
			<div className={`tooltip-box ${props.direction ?? 'left'} ${props.flip ? 'flip' : ''}`} style={cssVariables}>
				<div className='content-size'>
					{props.children}
				</div>
			</div>
		</div>
	);
}