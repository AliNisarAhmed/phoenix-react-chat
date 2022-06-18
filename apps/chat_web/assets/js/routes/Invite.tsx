import ky from 'ky';
import React, { useCallback, useEffect, useState } from 'react';
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

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let timer;
    if (currentUser) {
      checkInvite(currentUser);
    } else {
      setIsLoading(false);
    }

    async function checkInvite(user: User) {
      try {
        await addUserToRoom(user);
      } catch (error) {
        console.log('error :>> ', { error });
        if (error.response.status === 404) {
          setError('Room not found, taking you to lobby');
        } else {
          setError("An error occurred while joining, going to Lobby instead...")
        }
        timer = setTimeout(() => {
          navigate('/lobby');
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div>Checking Invite Link...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!currentUser) {
    return (
      <div>
        <UsernameSelection
          onUsernameSelect={async (user) => await setUserInStorage(user)}
        />
      </div>
    );
  }

  // if user is already present, show a loading screen
  // make a call to server to add user to invite list
  // and then redirect the user to the private room

  return <div>User set, loading...</div>;

  function navigateToRoom(room: PrivateRoom) {
    navigate(`/rooms/${room.room_id}`);
  }

  async function setUserInStorage(user: User) {
    localStorageAPI.setUser(user);
    await addUserToRoom(user);
  }

  async function addUserToRoom(user: User) {
    const room = await ky
      .post(`/api/rooms/invite`, {
        json: {
          username: user.username,
          invite_code: inviteCode,
        },
      })
      .json<PrivateRoom>();
    setRoom(room);
    navigateToRoom(room);
  }
};

export default Invite;
