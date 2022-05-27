import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Provider, useSocket, useChannel, usePresence } from 'phoenix-provider';
import { Channel, Presence } from 'phoenix';
import { generate } from 'canihazusername';

interface IProps {}

const App: React.FC<IProps> = (props) => {
	return (
		<Provider url={'/socket'} options={{}}>
			<Main />
		</Provider>
	);
};

type Msg = ChatMsg | AnnouncementMsg;

interface ChatMsg {
	text: string;
	username: string;
}

interface AnnouncementMsg {
	text: string;
}

function isChatMsg(msg: Msg): msg is ChatMsg {
	return (msg as ChatMsg).username !== undefined;
}

interface UserMetas {
	metas: {
		online_at: string;
		username: string;
	}[];
}

interface User {
	online_at: string;
	username: string;
}

function convertUserMetasToUser(list: UserMetas[]): User[] {
	return list.map(({ metas }) => ({
		username: metas[0].username,
		online_at: metas[0].online_at,
	}));
}

const Main = () => {
	const [messages, setMessages] = useState<Msg[]>([]);
	const [messageText, setMessageText] = useState<string>('');
	const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

	const username = useRef(generate());
	const channel: Channel = useChannel('rooms:lobby', { username: username.current });
	const presence = useRef<Presence>(null);

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

		const presence = new Presence(channel);

		presence.onJoin((key, currentPresence) => {
			if (currentPresence && username.current === key) {
				setMessages((prev) => [...prev, { text: `you joined the chat...` }]);
			} else if (currentPresence || username.current !== key) {
				setMessages((prev) => [...prev, { text: `${key} joined the chat...` }]);
			}
		});

		presence.onLeave((key, currentPresence) => {
			setMessages((prev) => [...prev, { text: `${key} left the chat...` }]);
		});

		presence.onSync(() => {
			setOnlineUsers(convertUserMetasToUser(presence.list()));
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
				{messages.map((msg) => {
					if (isChatMsg(msg)) {
						return (
							<div>
								<span>{msg.username}</span>: <span>{msg.text}</span>
							</div>
						);
					} else {
						return <div>{msg.text}</div>;
					}
				})}
			</div>
			<form onSubmit={submitMessage}>
				<input value={messageText} onChange={(e) => setMessageText(e.target.value)} />
			</form>
			<div>
				<h2>Online right now</h2>
				{onlineUsers.map((user) => (
					<p>{user.username}</p>
				))}
			</div>
		</div>
	);

	function submitMessage(e: FormEvent) {
		e.preventDefault();
		channel.push('submit_message', { text: messageText, username: username.current });
		setMessageText('');
	}
};

export default App;
