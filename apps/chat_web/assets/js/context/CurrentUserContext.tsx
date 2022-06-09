import React, { useRef, createContext, useContext } from 'react';
import { generate } from 'canihazusername';
import randomcolor from '../../vendor/randomcolor';
import { User } from '../types';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

const CurrentUserContext = createContext<User | null>(null);
const key = 'USER_DATA';

export const CurrentUserProvider = ({ children }) => {
	const newUser = generateRandomUser();
	const [user, setUser, deleteUser] = useLocalStorage<User | null>(key, newUser);
	if (user === null) {
		writeStorage(key, newUser);
	}

	return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUserContext = () => {
	const context = useContext(CurrentUserContext);
	// if (!context) {
	// 	throw new Error('probably forgot to wrap things with CurrentUserProvider');
	// }
	return context;
};

function generateRandomUser() {
	return {
		username: generate(),
		color: randomcolor(),
		blockedList: [],
	};
}
