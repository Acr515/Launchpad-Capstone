import { type HTMLAttributes, type PropsWithChildren, useContext } from 'react';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import './style.scss';

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
}

export default function InlineSource(props: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>): React.JSX.Element {
	const colors = useContext(ColorSchemeContext);

	const cssVariables: ICSSVariables = {
		...props.style,
		'--primary-color': colors.primaryColor,
	};

	return (
		<span className={`_InlineSource ${props.className ?? ''}`} style={cssVariables}>{props.children}</span>
	);
}