import { type CSSProperties, type HTMLAttributes, type PropsWithChildren, useContext } from 'react';
import ColorSchemeContext from 'ts/context/ColorSchemeContext';
import MultiStepMarker from '../MultiStepMarker';
import type MultiStepMarkerPairs from 'ts/types/MultiStepMarkerPairs';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	/** Pairs of refs; two concurrent arrays of multistep marker ref objects. */
	multiStepRefs?: MultiStepMarkerPairs;
	/** Proportions of the image with which to position multistep markers. */
	multiStepMarkerPositions?: { x: number; y: number }[];
	/** An image to show next to this step. */
	image?: string;
	/** The maximum width in `em` units of the image. */
	imageMaxWidth?: number;
	/** Any number of rectangles to draw on the image to highlight areas of interest. */
	imageHighlights?: { x1: number; y1: number; x2: number; y2: number }[];
	/** OBSOLETE. Use children instead */
	text?: string;
}

interface IRectCSSVariables extends CSSProperties {
	'--x1': string;
	'--x2': string;
	'--y1': string;
	'--y2': string;
}

interface ICSSVariables extends CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
}

/**
 * A generic step with basic text content.
 */
export default function GenericStep(props: IProps): React.JSX.Element {
	const colors = useContext(ColorSchemeContext);
	const cssVariables: ICSSVariables = {
		'--primary-color': colors.primaryColor,
		'--secondary-color': colors.secondaryColor,
	};

	return (
		<div className='_GenericStep' style={cssVariables}>
			<div className='step-column'>
				{props.children}
			</div>
			<div className={`step-column image ${typeof props.image === 'undefined' ? 'empty' : ''}`}>
				{
					typeof props.image !== 'undefined' && (
						<div className='step-image-container' style={ typeof props.imageMaxWidth === 'undefined' ? {} : { maxWidth: `${props.imageMaxWidth}em` }}>
							<img src={props.image} className='step-image' />
							{
								(typeof props.multiStepRefs?.image !== 'undefined' && typeof props.multiStepMarkerPositions !== 'undefined') && (
									props.multiStepRefs.image.map((ref, index) => (
										<MultiStepMarker
											key={index}
											index={index}
											type='image'
											myRef={ref}
											pairRef={props.multiStepRefs!.inline[index]}
											coordinates={props.multiStepMarkerPositions![index]}
										/>
									))
								)
							}
							{
								(typeof props.imageHighlights !== 'undefined' && (
									props.imageHighlights.map((coordinates, index) => (
										<div
											className='image-highlight'
											key={index}
											style={
												{
													'--x1': `${coordinates.x1}`,
													'--x2': `${coordinates.x2}`,
													'--y1': `${coordinates.y1}`,
													'--y2': `${coordinates.y2}`,
												} as IRectCSSVariables
											}
										/>
									))
								))
							}
						</div>
					)
				}
			</div>
		</div>
	);
}