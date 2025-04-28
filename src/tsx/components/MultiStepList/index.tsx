import { Children, type HTMLAttributes, type PropsWithChildren } from 'react';
import MultiStepMarker from '../MultiStepMarker';
import type MultiStepMarkerPairs from 'ts/types/MultiStepMarkerPairs';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	multiStepRefs?: MultiStepMarkerPairs;
}

/**
 * In combination with markers associated with an image, creates a list with labeled markers.
 */
export default function MultiStepList(props: IProps): React.JSX.Element {
	return (
		<ol className='_MultiStepList'>
			{
				Children.map(props.children, (child, index) => {
					return (
						<li className='multi-step-list-item' key={index}>
							<MultiStepMarker
								type='inline'
								index={index}
								myRef={props.multiStepRefs?.inline[index]}
								pairRef={props.multiStepRefs?.image[index]}
							/>
							{child}
						</li>
					);
				})
			}
		</ol>
	);
}