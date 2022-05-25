import React, { useEffect, useState } from 'react';
import { Provider, useSocket, useChannel } from 'phoenix-provider';
import { Channel } from 'phoenix';

interface IProps {}

const App: React.FC<IProps> = (props) => {
	return (
		<Provider url={'/socket'} options={{}}>
			<Main />
		</Provider>
	);
};

const Main = () => {
	const channel: Channel = useChannel('rooms:lobby');

	useEffect(() => {
		if (!channel) return;
		channel
			.join()
			.receive('ok', (resp) => {
				console.log('resp on channel joining', resp);
			})
			.receive('error', (resp) => {
				console.log('resp on error: ', resp);
			});

		channel.on('welcome', (message) => {
			console.log('event: ', message);
		});

		return () => {
			channel.leave();
		};
	}, [channel]);

	return (
		<div className="">
			<h1>Hello</h1>
		</div>
	);
};

export default App;
