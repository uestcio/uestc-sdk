import { User } from '../models/user';

export class Cacher {
    users: { [id: string]: User; };
}
