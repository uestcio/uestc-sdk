import { User } from '../models/user';

export class Cacher {
    users: { [id: string]: User; };
    
    constructor () {
        this.users = {};
    }
}

export const cacher: Cacher = new Cacher();
