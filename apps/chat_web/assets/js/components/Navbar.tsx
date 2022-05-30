import { Container, Heading } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { userCurrentUserContext } from '../context/CurrentUserContext';

const Navbar = () => {
	const user = userCurrentUserContext();
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
