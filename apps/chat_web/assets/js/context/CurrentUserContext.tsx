import useLocalStorage from '@rehooks/local-storage';
import React, { createContext, useContext } from 'react';

import { key } from '../localStorage';
import { User } from '../types';

type CurrentUserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
};

const CurrentUserContext = createContext<CurrentUserContextType>({
  currentUser: null,
  setCurrentUser: (_) => {},
});

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage(key, null);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => useContext(CurrentUserContext);
