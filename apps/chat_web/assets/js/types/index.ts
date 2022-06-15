export interface ChatMsg {
  text: string;
  user: User;
}

export interface AnnouncementMsg {
  text: string;
}

export type Msg = ChatMsg | AnnouncementMsg;

export function isChatMsg(msg: Msg): msg is ChatMsg {
  return (msg as ChatMsg).user !== undefined;
}

export interface UserMetas {
  metas: {
    online_at: string;
    username: string;
    color: string;
  }[];
}

export type UserStatus = 'loggedIn' | 'loggedOut';

export interface User {
  online_at?: string;
  username: string;
  color: string;
  blockedList: Record<string, boolean>;
  status?: UserStatus;
}

export type PrivateRoom = {
  owner: string;
  room_id: string;
  topic: string | null;
  shareable_code: string;
};

export function convertUserMetasToUser(list: UserMetas[]): User[] {
  return list.map(({ metas }) => ({
    username: metas[0].username,
    online_at: metas[0].online_at,
    color: metas[0].color,
    blockedList: {},
  }));
}
