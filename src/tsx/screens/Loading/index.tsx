import { type HTMLAttributes } from 'react';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	loadingFinished?: boolean;
}

interface ICSSVariables extends React.CSSProperties {
	'--order': string;
}

/**
 * Shows a full-screen, blocking loading screen. Intended for use on launch.
 */
function Loading({ loadingFinished }: IProps) {
	const disappearing = loadingFinished ?? false;

	return (
		<div className={`_Loading _Screen ${disappearing ? 'vanish' : ''}`}>
			<span className='loading-label'>Loading...</span>
			<div className='loading-graphics'>
				<span className='loading-bubble' style={{ '--order': '0' } as ICSSVariables}/>
				<span className='loading-bubble' style={{ '--order': '1' } as ICSSVariables}/>
				<span className='loading-bubble' style={{ '--order': '2' } as ICSSVariables}/>
				<span className='loading-bubble' style={{ '--order': '3' } as ICSSVariables}/>
				<span className='loading-bubble' style={{ '--order': '4' } as ICSSVariables}/>
			</div>
		</div>
	);
}

export default Loading;