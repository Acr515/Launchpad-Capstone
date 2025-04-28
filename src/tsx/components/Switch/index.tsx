import { type ChangeEvent, useState } from 'react';
import './style.scss';

function Switch(props: React.InputHTMLAttributes<HTMLInputElement>): React.JSX.Element {
	const [checked, setChecked] = useState(props.defaultChecked);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setChecked(!checked);
		if (typeof props.onChange !== 'undefined') { props.onChange(event); }
	};

	return (
		<label className={`_Switch ${props.className ?? ''}`}>
			<input
				type='checkbox'
				checked={checked}
				onChange={onChange}
			/>
			<span className='slider'></span>
		</label>
	);
}

export default Switch;