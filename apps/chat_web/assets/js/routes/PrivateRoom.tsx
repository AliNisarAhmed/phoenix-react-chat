import { Container, Flex, SimpleGrid } from '@chakra-ui/react';
import React, { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import CurrentOnline from '../components/CurrentOnline';
import MessageDisplay from '../components/MessageDisplay';
import MessageSubmit from '../components/MessageSubmit';
import { userCurrentUserContext } from '../context/CurrentUserContext';
import { sendMessage, useChannel } from '../hooks/useChannel';
import { useEventHandler } from '../hooks/useEventHandler';
import { usePresence } from '../hooks/usePresence';
import { convertUserMetasToUser, Msg, User, UserMetas } from '../types';

interface Props {}

const PrivateRoom = ({}: Props) => {
	const { roomId } = useParams();

	const [messages, setMessages] = useState<Msg[]>([]);
	const [messageText, setMessageText] = useState<string>('');
	const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

	const user = userCurrentUserContext();

	const channel = useChannel(
		`rooms:${roomId}`,
		{
			username: user.username,
			color: user.color,
		},
		(resp) => {
			console.log('resp on joining', resp);
		},
		(resp) => console.log('resp on error: ', resp)
	);

	usePresence(channel, onJoin, onLeave, onSync);

	useEventHandler(channel, 'new_message', (payload) => {
		setMessages((prev) => [...prev, payload]);
	});

	return (
		<SimpleGrid columns={2} spacing={10} templateColumns="2fr 1fr">
			<Flex direction="column">
				<MessageDisplay messages={messages} />
				<MessageSubmit
					onSubmit={submitMessage}
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
				/>
			</Flex>
			<CurrentOnline onlineUsers={onlineUsers} />
		</SimpleGrid>
	);

	function onJoin(key, currentPresence) {
		if (currentPresence && user.username === key) {
			setMessages((prev) => [...prev, { text: `you joined the chat...` }]);
		} else if (currentPresence || user.username !== key) {
			setMessages((prev) => [...prev, { text: `${key} joined the chat...` }]);
		}
	}

	function onLeave(key: string) {
		setMessages((prev) => [...prev, { text: `${key} left the chat...` }]);
	}

	function onSync(list: UserMetas[]) {
		console.log('list: ', list);
		setOnlineUsers(convertUserMetasToUser(list));
	}

	function submitMessage(e: FormEvent) {
		e.preventDefault();
		sendMessage(channel, 'submit_message', { text: messageText, user });
		setMessageText('');
	}
};

export default PrivateRoom;
