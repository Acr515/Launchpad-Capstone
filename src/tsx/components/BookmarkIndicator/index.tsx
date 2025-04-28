import { HTMLAttributes, memo } from 'react';
import Image from '../Image';
import images from 'assets/images';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	/** Whether to light up this component. */
	active: boolean;
	/** Whether this step is bookmarked. */
	enabled: boolean;
	/** If true, stylizes in response to hover and click events. */
	interactive?: boolean;
}

function BookmarkIndicator(props: IProps): React.JSX.Element {
	const interactive = props.interactive ?? false;

	return (
		<span
			className={`_BookmarkIndicator${props.enabled ? ' enabled' : ' '}${props.active ? ' active' : ' '}${interactive ? ' interactive' : ' '}${props.className ?? ''}`}
			onClick={props.onClick}
		>
			<Image
				manageColor={false}
				icon
				className='bookmark-icon'
				image={images.icons.bookmark}
			/>
			<Image
				manageColor={false}
				icon
				className='bookmark-icon-fill'
				image={images.icons.bookmarkFilled}
			/>
		</span>
	);
}

export default memo(BookmarkIndicator);