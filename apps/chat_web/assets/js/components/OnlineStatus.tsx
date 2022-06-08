import React from 'react';
import { useOnlineStatus } from '../context/OnlineStatusProvider';

interface Props {
	size: 'sm' | 'lg';
	on?: boolean;
}

const OnlineStatus = ({ size, on }: Props) => {
	const onlineStatus = useOnlineStatus();

	return (
		<div
			style={{
				borderColor: on || onlineStatus ? 'green' : 'red',
				border: '1px solid green',
				width: size === 'sm' ? '5px' : '10px',
				height: size === 'sm' ? '5px' : '10px',
				borderRadius: '100%',
				backgroundColor: on || onlineStatus ? 'green' : 'red',
				display: 'inline',
			}}
		/>
	);
};

export default OnlineStatus;
