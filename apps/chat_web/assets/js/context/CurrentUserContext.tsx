import React, { createContext, useContext } from 'react';

import * as localStorageAPI from '../localStorage';
import { User } from '../types';

const CurrentUserContext = createContext<User | null>(null);

export const CurrentUserProvider = ({ children }) => {
  const [user] = localStorageAPI.getUserData();

  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => useContext(CurrentUserContext);
