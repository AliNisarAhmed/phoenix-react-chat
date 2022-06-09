import useLocalStorage, { writeStorage } from '@rehooks/local-storage';
import { LocalStorageReturnValue } from '@rehooks/local-storage/lib/use-localstorage';

import { User, UserStatus } from '../types';

const key = '118359056996_USER_DATA';

export function getUserData(): LocalStorageReturnValue<User | null> {
  return useLocalStorage(key, null);
}

export function setUserStatus(newStatus: UserStatus) {
  const user: User | null = JSON.parse(localStorage.getItem(key));

  if (!user) {
    throw new Error('cannot modify null user');
  }

  writeStorage(key, { ...user, status: newStatus });
}

export function setUser(user: User) {
  writeStorage(key, user);
}
