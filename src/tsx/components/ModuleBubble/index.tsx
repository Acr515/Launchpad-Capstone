import { type HTMLAttributes, type PropsWithChildren } from 'react';
import images from 'assets/images';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	primaryColor: string;
	secondaryColor: string;
	innerClassName?: string;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
}

/**
 * Renders a stylized bubble that can be filled with any content. Used to represent modules.
 */
function ModuleBubble(props: IProps): React.JSX.Element {
	const cssVariables: ICSSVariables = {
		'--primary-color': props.primaryColor,
		'--secondary-color': props.secondaryColor,
		...props.style,
	};

	return (
		<div className={`_ModuleBubble ${props.className ?? ''}`} style={cssVariables}>
			<div className={`bubble-background ${props.innerClassName ?? ''}`}>
				{props.children}
			</div>
			<div className='bubble-shadow' style={{ backgroundImage: `url('${images.graphics.bubbleShadow}')` }} />
		</div>
	);
}

export default ModuleBubble;