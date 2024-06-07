import bcrypt from 'bcrypt';

export const hash = (param: string) => bcrypt.hash(param, 7);
export const compare = (param1: string, param2: string) =>
  bcrypt.compare(param1, param2);
