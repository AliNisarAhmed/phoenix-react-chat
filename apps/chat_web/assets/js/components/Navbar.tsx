import { Container, Flex, Heading } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { PrivateRoom } from '../types';
import OnlineStatus from './OnlineStatus';

type ContextType = { room: PrivateRoom | null; setRoom: Dispatch<SetStateAction<PrivateRoom>> };

const Navbar = () => {
	const user = useCurrentUserContext();

	const [room, setRoom] = useState<PrivateRoom | null>(null);

	return (
		<>
			<Flex align="center">
				<NavbarHeading room={room} user={user} />
				<OnlineStatus size="lg" />
			</Flex>
			<Container border="2px" maxW="720px">
				<Outlet context={{ room, setRoom }} />
			</Container>
		</>
	);
};

export function useNavbarContext() {
	return useOutletContext<ContextType>();
}

const NavbarHeading = ({ room, user }) => {
	if (room === null) {
		return (
			<Heading as="h2" size="lg">
				Hello {user.username}
			</Heading>
		);
	}

	if (room.owner === user.username) {
		return (
			<Heading as="h2" size="lg">
				Welcome to your private room
			</Heading>
		);
	}

	return (
		<Heading as="h2" size="lg">
			In {room.owner}'s private room
		</Heading>
	);
};

export default Navbar;
