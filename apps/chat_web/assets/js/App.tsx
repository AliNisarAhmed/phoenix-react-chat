import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { Channel, Presence } from 'phoenix';
import { generate } from 'canihazusername';
import {
	ChakraProvider,
	Container,
	Flex,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	SimpleGrid,
} from '@chakra-ui/react';
import { SocketContext, SocketProvider } from './context/SocketContext';
import { sendMessage, useChannel } from './hooks/useChannel';
import { usePresence } from './hooks/usePresence';
import { useEventHandler } from './hooks/useEventHandler';
import { EmailIcon } from '@chakra-ui/icons';

interface IProps {}

const App: React.FC<IProps> = (props) => {
	return (
		<SocketProvider url={'/socket'}>
			<ChakraProvider>
				<Main />
			</ChakraProvider>
		</SocketProvider>
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
	const channel: Channel = useChannel('rooms:lobby', { username: username.current }, (msg) =>
		console.log('resp on channel JOIN', msg)
	);

	const presence = usePresence(channel, onJoin, onLeave, onSync);

	function onJoin(key, currentPresence) {
		if (currentPresence && username.current === key) {
			setMessages((prev) => [...prev, { text: `you joined the chat...` }]);
		} else if (currentPresence || username.current !== key) {
			setMessages((prev) => [...prev, { text: `${key} joined the chat...` }]);
		}
	}

	function onLeave(key, currentPresence) {
		setMessages((prev) => [...prev, { text: `${key} left the chat...` }]);
	}

	function onSync(list: UserMetas[]) {
		setOnlineUsers(convertUserMetasToUser(list));
	}

	useEventHandler(channel, 'new_message', (payload) => {
		console.log('payload :>> ', payload);
		setMessages((prev) => [...prev, payload]);
	});

	return (
		<Container border="2px" maxW="720px">
			<Heading as="h2" size="lg">
				Hello {username.current}
			</Heading>
			<SimpleGrid columns={2} spacing={10}>
				<Flex>
					<Container maxW="720px" bg="whiteAlpha.200" border="2px" borderColor="red.400">
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
					</Container>
					<form onSubmit={submitMessage}>
						<InputGroup>
							<InputRightElement
								children={<EmailIcon />}
								pointerEvents="all"
								color="green.500"
								fontSize="1.2em"
							/>
							<Input
								variant="outline"
								placeholder="Send a message"
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
							/>
						</InputGroup>
					</form>
				</Flex>
				<Container>
					<h2>Online right now</h2>
					{onlineUsers.map((user) => (
						<p>{user.username}</p>
					))}
				</Container>
			</SimpleGrid>
		</Container>
	);

	function submitMessage(e: FormEvent) {
		e.preventDefault();
		// channel.push('submit_message', { text: messageText, username: username.current });
		sendMessage(channel, 'submit_message', { text: messageText, username: username.current });
		setMessageText('');
	}
};

export default App;
