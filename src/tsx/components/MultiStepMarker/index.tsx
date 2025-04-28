import { type CSSProperties, type HTMLAttributes, useContext } from 'react';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	/** If 'image', provide top and left properties to move this on the image. */
	type: 'image' | 'inline';
	/** The index of this step marker, which tells the component what letter to assign. */
	index: number;
	/** This component's ref. */
	myRef?: React.RefObject<HTMLDivElement>;
	/** The ref of the marker opposite to this marker's type. */
	pairRef?: React.RefObject<HTMLDivElement>;
	/** If an image marker, these are [0, 1] coordinates of where to position the marker on the image. */
	coordinates?: { x: number; y: number };
}

interface ICSSVariables extends CSSProperties {
	'--x'?: string;
	'--y'?: string;
	'--primary-color': string;
	'--secondary-color': string;
}

// TODO: Find more efficient way to do this
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function MultiStepMarker(props: IProps): React.JSX.Element {
	const colors = useContext(ColorSchemeContext);
	const onMouseEnter = () => {
		if (typeof props.pairRef === 'undefined' || props.pairRef.current === null) { return; }
		props.pairRef.current.classList.add('hovered');
	};
	const onMouseLeave = () => {
		if (typeof props.pairRef === 'undefined' || props.pairRef.current === null) { return; }
		props.pairRef.current.classList.remove('hovered');
	};

	const cssVariables: ICSSVariables = {
		...(typeof props.coordinates !== 'undefined' ? {
			'--x': `${props.coordinates.x}`,
			'--y': `${props.coordinates.y}`,
		} : {}),
		'--primary-color': colors.primaryColor,
		'--secondary-color': colors.secondaryColor,
	};

	return (
		<div
			className={`_MultiStepMarker ${props.type}`}
			style={cssVariables}
			ref={props.myRef}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<span className='label'>{alphabet[props.index]}</span>
		</div>
	);
}