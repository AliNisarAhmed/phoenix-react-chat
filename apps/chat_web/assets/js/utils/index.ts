import { generate } from 'canihazusername';

import randomcolor from '../../vendor/randomcolor';

export function generateRandomUser() {
  return {
    username: generate(),
    color: randomcolor(),
    blockedList: {},
  };
}
