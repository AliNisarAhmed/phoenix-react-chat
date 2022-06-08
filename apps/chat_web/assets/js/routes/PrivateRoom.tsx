import { Box, Button, Container, Flex, Heading, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import React, { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CurrentOnline from '../components/CurrentOnline';
import MessageDisplay from '../components/MessageDisplay';
import MessageSubmit from '../components/MessageSubmit';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { sendMessage, useChannel } from '../hooks/useChannel';
import { useEventHandler } from '../hooks/useEventHandler';
import { usePresence } from '../hooks/usePresence';
import { convertUserMetasToUser, Msg, User, UserMetas } from '../types';
import { useNavbarContext } from '../components/Navbar';

interface Props {}

type PageState = 'loading' | 'ready';

const PrivateRoom = ({}: Props) => {
	const { roomId } = useParams();
	const navigate = useNavigate();

	const [pageState, setPageState] = useState<PageState>('loading');
	const [messages, setMessages] = useState<Msg[]>([]);
	const [messageText, setMessageText] = useState<string>('');
	const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

	const user = useCurrentUserContext();
	const { room, setRoom } = useNavbarContext();

	const channel = useChannel(
		`rooms:${roomId}`,
		{
			username: user.username,
			color: user.color,
		},
		(resp) => {
			console.log('successfully joined channel');
			setPageState('ready');
		},
		(resp) => {
			console.log('Error joining channel');
			setTimeout(() => {
				navigate('/');
			}, 4000);
		}
	);

	usePresence(channel, onJoin, onLeave, onSync);

	useEventHandler(channel, 'new_message', (payload) => {
		setMessages((prev) => [...prev, payload]);
	});

	useEventHandler(channel, 'private_room_closed', (_, _channel) => {
		console.log('private_room_closed', channel);
		_channel?.leave();
		navigate('/');
	});

	useEventHandler(channel, 'kick_user', ({ username }, _channel) => {
		if (username === user.username) {
			_channel?.leave();
			setRoom(null);
			navigate('/');
		}
	});

	if (pageState === 'loading') {
		return (
			<Container centerContent>
				<Spinner size="md" />
			</Container>
		);
	}

	return (
		<SimpleGrid columns={2} spacing={10} templateColumns="2fr 1fr">
			<Flex direction="column">
				<Box>
					<Heading as="h3" display="inline">
						Topic:{' '}
					</Heading>
					<Text display="inline">{room.topic}</Text>
				</Box>
				<Button onClick={goBackToLobby} colorScheme="blue">
					Go back to Lobby
				</Button>
				<MessageDisplay messages={messages} />
				<MessageSubmit
					onSubmit={submitMessage}
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
				/>
			</Flex>
			<CurrentOnline
				onlineUsers={onlineUsers.filter((u) => u.username !== user.username)}
				privateRoom
				currentUser={user}
				kickUser={kickUser}
			/>
		</SimpleGrid>
	);

	function kickUser(username: string) {
		sendMessage(channel, 'kick_user', { username, room_id: roomId });
	}

	function goBackToLobby() {
		if (room.owner === user.username) {
			sendMessage(channel, 'private_room_closed', { room_id: roomId });
		}
		channel?.leave();
		setRoom(null);
		navigate('/');
	}

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
		console.log('submitting a message', channel);
		sendMessage(channel, 'submit_message', { text: messageText, user });
		setMessageText('');
	}
};

export default PrivateRoom;
