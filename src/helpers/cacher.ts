import { User } from '../models/user';


export interface IUserCache {
    [id: string]: User;
}

export class Cacher {
    private _users: IUserCache = {};
    
    get users(): IUserCache {
        return this._users;
    }

    constructor() {
        this.users = {};
    }
}

export const defaultCacher: Cacher = new Cacher();
