import { generate } from 'canihazusername';

import randomcolor from '../../vendor/randomcolor';

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
  'purple.200'
]