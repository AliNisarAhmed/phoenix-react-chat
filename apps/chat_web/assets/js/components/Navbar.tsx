import { Container, Heading } from '@chakra-ui/react';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { userCurrentUserContext } from '../context/CurrentUserContext';

const Navbar = () => {
	const user = userCurrentUserContext();
	const location = useLocation();

	if (location.pathname.startsWith('/rooms/')) {
		return (
			<>
				<Heading as="h2" size="lg">
					{user.username}'s Private Room
				</Heading>
				<Container border="2px" maxW="720px">
					<Outlet />
				</Container>
			</>
		);
	}

	return (
		<>
			<Heading as="h2" size="lg">
				Hello {user.username}
			</Heading>
			<Container border="2px" maxW="720px">
				<Outlet />
			</Container>
		</>
	);
};

export default Navbar;
