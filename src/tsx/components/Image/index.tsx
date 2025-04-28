import { HTMLAttributes, memo } from 'react';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	/** The Node import of the image to display. */
	image: string;
	/** If true, renders a monochromatic icon to be colored with the `color` prop. */
	icon?: boolean;
	/** The color to use for the icon. */
	color?: string;
	/** Alt text to use for the image. */
	alt?: string;
	/** Defaults to true. If false, exposes the --color CSS variable so that stylesheets can easily manage the icon's color. */
	manageColor?: boolean;
}

/**
 * Renders a given image or icon. In its default state, it will fill the size of its parent.
 */
function Image(props: IProps): React.JSX.Element {
	const icon = props.icon ?? false;
	const color = props.color ?? '#fff';
	const manageColor = props.manageColor ?? true;

	return (
		<div className={`_Image ${props.className ?? ''}`}>
			{ icon ? (
				<span className={`icon-mask${manageColor ? ' managed' : ''}`} style={{
					...(manageColor ? { backgroundColor: color } : {}),
					maskImage: `url("${props.image}")`,
				}}>
					<img className='icon-image' src={props.image} alt={props.alt ?? ''}/>
				</span>
			) : (
				<img className='image' src={props.image} alt={props.alt ?? ''}/>
			)}
		</div>
	);
}

export default memo(Image);