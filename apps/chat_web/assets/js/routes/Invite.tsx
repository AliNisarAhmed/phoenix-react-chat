import ky from 'ky';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useNavbarContext } from '../components/Navbar';
import UsernameSelection from '../components/UsernameSelection';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import * as localStorageAPI from '../localStorage';
import { PrivateRoom, User } from '../types';

interface Props {}

const Invite = ({}: Props) => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useCurrentUserContext();

  const { setRoom } = useNavbarContext();

  if (!currentUser) {
    return (
      <div>
        <UsernameSelection
          onUsernameSelect={async (user) => await addUserToRoom(user)}
        />
      </div>
    );
  }

  // if user is already present, show a loading screen
  // make a call to server to add user to invite list
  // and then redirect the user to the private room

  return <div>User set, loading...</div>;

  async function addUserToRoom(user: User) {
    localStorageAPI.setUser(user);
    const room = await ky
      .post(`/api/rooms/invite`, {
        json: {
          username: user.username,
          invite_code: inviteCode,
        },
      })
      .json<PrivateRoom>();
    setRoom(room);

    navigate(`/rooms/${room.room_id}`);
  }
};

export default Invite;
