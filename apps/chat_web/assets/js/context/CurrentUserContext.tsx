import React, { useRef, createContext, useContext } from 'react';
import generate from 'canihazusername';
import randomcolor from '../../vendor/randomcolor';
import { User } from '../types';

const CurrentUserContext = createContext<User | null>(null);

export const CurrentUserProvider = ({ children }) => {
	const user = useRef(generateRandomUser());

	return <CurrentUserContext.Provider value={user.current}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUserContext = () => {
	const context = useContext(CurrentUserContext);
	if (!context) {
		throw new Error('probably forgot to wrap things with CurrentUserProvider');
	}
	return context;
};

function generateRandomUser() {
	return {
		username: generate(),
		color: randomcolor(),
	};
}
