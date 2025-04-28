import { HTMLAttributes, memo, useContext } from 'react';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	/** Whether to light up this component. */
	active: boolean;
	/** If true, stylizes in response to hover and click events. */
	interactive?: boolean;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
}

function SubsectionIndicator(props: IProps): React.JSX.Element {
	const colors = useContext(ColorSchemeContext);
	const interactive = props.interactive ?? false;
	const cssVariables: ICSSVariables = {
		'--primary-color': colors.primaryColor,
		'--secondary-color': colors.secondaryColor,
		...(props.style ?? {}),
	};

	return (
		<span
			className={`_SubsectionIndicator${props.active ? ' active' : ' '}${interactive ? ' interactive' : ' '}${props.className ?? ''}`}
			style={cssVariables}
			onClick={props.onClick}
		>
			<span className='inside-shadow'></span>
		</span>
	);
}

export default memo(SubsectionIndicator);