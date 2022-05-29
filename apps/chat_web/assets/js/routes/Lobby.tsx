import generate from 'canihazusername';
import { Channel } from 'phoenix';
import React, { FormEvent, useRef, useState } from 'react';
import { sendMessage, useChannel } from '../hooks/useChannel';
import { useEventHandler } from '../hooks/useEventHandler';
import { usePresence } from '../hooks/usePresence';
import { convertUserMetasToUser, isChatMsg, Msg, User, UserMetas } from '../types';
import {
	Container,
	Flex,
	Heading,
	SimpleGrid,
} from '@chakra-ui/react';
import CurrentOnline from '../components/CurrentOnline';
import MessageDisplay from '../components/MessageDisplay';
import randomcolor from '../../vendor/randomcolor';
import MessageSubmit from '../components/MessageSubmit';

const Lobby = () => {
	const [messages, setMessages] = useState<Msg[]>([]);
	const [messageText, setMessageText] = useState<string>('');
	const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

	const user = useRef(generateRandomUser());
	const channel: Channel = useChannel('rooms:lobby', {
		username: user.current.username,
		color: user.current.color,
	});

	usePresence(channel, onJoin, onLeave, onSync);

	function onJoin(key, currentPresence) {
		if (currentPresence && user.current.username === key) {
			setMessages((prev) => [...prev, { text: `you joined the chat...` }]);
		} else if (currentPresence || user.current.username !== key) {
			setMessages((prev) => [...prev, { text: `${key} joined the chat...` }]);
		}
	}

	function onLeave(key: string) {
		setMessages((prev) => [...prev, { text: `${key} left the chat...` }]);
	}

	function onSync(list: UserMetas[]) {
		setOnlineUsers(convertUserMetasToUser(list));
	}

	useEventHandler(channel, 'new_message', (payload) => {
		setMessages((prev) => [...prev, payload]);
	});

	return (
		<Container border="2px" maxW="720px">
			<Heading as="h2" size="lg">
				Hello {user.current.username}
			</Heading>
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
		</Container>
	);

	function submitMessage(e: FormEvent) {
		e.preventDefault();
		sendMessage(channel, 'submit_message', { text: messageText, user: user.current });
		setMessageText('');
	}
};

function generateRandomUser() {
	return {
		username: generate(),
		color: randomcolor(),
	};
}

export default Lobby;
