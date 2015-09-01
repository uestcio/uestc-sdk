import { User } from 'models/user';

export class Cacher {
    static users: { [id: string]: User; };
}
