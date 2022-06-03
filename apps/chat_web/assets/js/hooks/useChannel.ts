import { Channel, Push } from 'phoenix';
import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../context/SocketContext';

type OnJoinFunc = (resp: any) => any;
type OnErrorFunc = (resp: any) => any;

export function useChannel(
	topic: string,
	params: any,
	onJoin: OnJoinFunc = () => {},
	onError: OnErrorFunc = () => {}
): Channel | null {
	const socket = useContext(SocketContext);
	const [channel, setChannel] = useState<Channel | null>(null);

	const onJoinFunc = useRef(onJoin);
	const onErrorFunc = useRef(onError);

	useEffect(() => {
		if (socket) {
			const _channel = socket.channel(topic, params);
			_channel
				.join()
				.receive('ok', (message) => onJoinFunc.current(message))
				.receive('error', (resp) => {
					_channel.leave();
					onErrorFunc.current(resp);
				});
			setChannel(_channel);

			return () => {
				channel?.leave();
				setChannel(null);
			};
		}
	}, [socket, topic]);

	return channel;
}

export function sendMessage(
	channel: Channel,
	eventName: string,
	payload: object,
	timeout?: number
) {
	return pushPromisified(channel.push(eventName, payload, timeout));
}

function pushPromisified(push: Push) {
	return new Promise((resolve, reject) => {
		if (!push) {
			return reject('No Push');
		}

		push.receive('ok', resolve).receive('error', reject).receive('timeout', reject);
	});
}
