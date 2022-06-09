import React, { createContext, useContext } from 'react';
import { User } from '../types';
import { useLocalStorage } from '@rehooks/local-storage';

const CurrentUserContext = createContext<User | null>(null);
export const key = 'USER_DATA';

export const CurrentUserProvider = ({ children }) => {
	const [user, ] = useLocalStorage<User | null>(key, null);

	return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUserContext = () => useContext(CurrentUserContext);


