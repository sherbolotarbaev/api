import bcrypt from 'bcrypt';

export const hash = (param: string): Promise<string> => bcrypt.hash(param, 7);
export const compare = (param1: string, param2: string): Promise<boolean> =>
  bcrypt.compare(param1, param2);
