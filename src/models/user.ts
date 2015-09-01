///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

export class User {
    id: string;
    password: string;
    isConfirmed: boolean;
    
    constructor (id: string, password: string) {
        this.id = id;
        this.password = password;
        this.isConfirmed = false;
    }
    
    confirm (): Observable<User> {
        return null;
    }
}

