import { Container, Heading } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useCurrentUserContext } from '../context/CurrentUserContext';

type ContextType = { owner: string | null; setOwner: Dispatch<SetStateAction<string>> };

const Navbar = () => {
	const user = useCurrentUserContext();

	const [owner, setOwner] = useState<string | null>(null);

	return (
		<>
			<NavbarHeading owner={owner} user={user} />
			<Container border="2px" maxW="720px">
				<Outlet context={{ owner, setOwner }} />
			</Container>
		</>
	);
};

export function useNavbarContext() {
	return useOutletContext<ContextType>();
}

const NavbarHeading = ({ owner, user }) => {
	if (owner === user.username) {
		return (
			<Heading as="h2" size="lg">
				Welcome to your private room
			</Heading>
		);
	}

	if (owner === null) {
		return (
			<Heading as="h2" size="lg">
				Hello {user.username}
			</Heading>
		);
	}

	return (
		<Heading as="h2" size="lg">
			In {owner}'s private room
		</Heading>
	);
};

export default Navbar;
