import { writeStorage } from '@rehooks/local-storage';

import { User, UserStatus } from '../types';

export const key = '118359056996_USER_DATA';

export function setUserStatus(newStatus: UserStatus) {
  const user: User | null = JSON.parse(localStorage.getItem(key));

  if (!user) {
    throw new Error('cannot modify null user');
  }

  writeStorage(key, { ...user, status: newStatus });
}

export function setBlockStatus(username: string, status: boolean) {
  const user: User | null = JSON.parse(localStorage.getItem(key));

  if (!user) {
    throw new Error('cannot modify null user');
  }

  const updatedUser: User = {
    ...user,
    blockedList: { ...user.blockedList, [username]: status },
  };

  writeStorage(key, updatedUser);
}

export function setUser(user: User) {
  writeStorage(key, user);
}
