import { generate } from 'canihazusername';

import { PrivateRoom, User } from '../types';

export function generateRandomUser() {
  return {
    username: generate(),
    color: pickRandomColor(),
    blockedList: {},
  };
}

function pickRandomColor(mode = 'dark') {
  return pickRandomValue(darkModeColors);
}

function pickRandomValue(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const darkModeColors = [
  'red.100',
  'red.200',
  'pink.100',
  'pink.200',
  'purple.100',
  'purple.200',
  'blue.100',
  'blue.200',
  'orange.100',
  'orange.200',
  'yellow.100',
  'yellow.200',
  'cyan.100',
  'cyan.200',
  'bisque.100',
  'bisque.200',
  'aquamarine.100',
  'aquamarine.200',
  'darkslateblue.100',
  'darkslateblue.200',
];

export function isOwner(currentUser: User, room: PrivateRoom): boolean {
  return currentUser.username === room.owner;
}
