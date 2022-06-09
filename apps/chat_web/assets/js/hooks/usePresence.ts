import {
  Channel,
  Presence,
  PresenceOnJoinCallback,
  PresenceOnLeaveCallback,
} from 'phoenix';
import { useEffect, useRef } from 'react';

export const usePresence = (
  channel: Channel | null,
  onJoin: PresenceOnJoinCallback = () => {},
  onLeave: PresenceOnLeaveCallback = () => {},
  onSync: (list: any) => void = () => {},
) => {
  let presence: Presence;
  const onJoinRef = useRef(onJoin);
  const onLeaveRef = useRef(onLeave);
  const onSyncRef = useRef(onSync);

  useEffect(() => {
    if (channel) {
      presence = new Presence(channel);
      presence.onJoin(onJoinRef.current);
      presence.onLeave(onLeaveRef.current);
      presence.onSync(() => onSyncRef.current(presence.list()));
    }
  }, [channel]);

  return presence;
};
