///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

export class User {
    constructor (id: string, password: string) {
        
    }
    
    confirm (): Observable<User> {
        return null;
    }
}

