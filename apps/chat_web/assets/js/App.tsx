import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Provider, useSocket, useChannel } from 'phoenix-provider';
import { Channel } from 'phoenix';
import { generate } from 'canihazusername';

interface IProps {}

const App: React.FC<IProps> = (props) => {
	return (
		<Provider url={'/socket'} options={{}}>
			<Main />
		</Provider>
	);
};

interface ChatMessage {
	text: string;
	username: string;
}

const Main = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messageText, setMessageText] = useState<string>('');
	const username = useRef(generate());
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

		channel.on('new_message', (payload) => {
			console.log('new_message', payload);
			setMessages((prev) => [...prev, payload]);
		});

		return () => {
			channel.leave();
		};
	}, [channel]);

	return (
		<div className="">
			<h1>Hello {username.current}</h1>
			<div>
				{messages.map((msg) => (
					<div>
						<span>{msg.username}</span>: <span>{msg.text}</span>
					</div>
				))}
			</div>
			<form onSubmit={submitMessage}>
				<input value={messageText} onChange={(e) => setMessageText(e.target.value)} />
			</form>
		</div>
	);

	function submitMessage(e: FormEvent) {
		e.preventDefault();
		channel.push('submit_message', { text: messageText, username: username.current });
		setMessageText('');
	}
};

export default App;
