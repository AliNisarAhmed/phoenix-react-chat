import useLocalStorage from '@rehooks/local-storage';
import React, { createContext, useContext } from 'react';

import { key } from '../localStorage';
import { User } from '../types';

type CurrentUserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  setBlockedStatus: (username: string, status: boolean) => void;
};

const CurrentUserContext = createContext<CurrentUserContextType>({
  currentUser: null,
  setCurrentUser: (_) => {},
  setBlockedStatus: (_) => {},
});

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>(key, null);

  function setBlockedStatus(username: string, status: boolean = true) {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        blockedList: { ...currentUser.blockedList, [username]: status },
      });
    }
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, setBlockedStatus }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => useContext(CurrentUserContext);
