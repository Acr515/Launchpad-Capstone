import { type HTMLAttributes, type PropsWithChildren } from 'react';
import './style.scss';

interface IProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
	jumpConfig?: {
		toEnd?: boolean;
		index: number;
	};
}

export default function SecondaryTooltip(props: IProps) {
	return (
		<span
			className={`_SecondaryTooltip ${props.className ?? ''}`}
		>
			{ typeof props.jumpConfig === 'undefined' ? props.children : (
				<>
					Click to jump to { props.jumpConfig.toEnd === true ? (
						<span className='jump-index'>the end of the task</span>
					) : (
						<span className='jump-index'>step {props.jumpConfig.index + 1}</span>
					) }
				</>
			)}
		</span>
	);
}