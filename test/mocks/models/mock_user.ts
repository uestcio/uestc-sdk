///<reference path="../../../typings/request/request"/>
///<reference path="../../../typings/rx/rx"/>
///<reference path="../../../typings/rx/rx-lite"/>


import * as Request from 'request';
import { Observable } from 'rx';

import { User, UserFactory } from '../../../src/models/user';
import {  } from '../../../src/utils/interfaces';

import { defaultMockCaller } from '../helpers/mock_caller';
import { defaultMockFetcher} from '../helpers/mock_fetcher';
import { defaultMockSeeker } from '../helpers/mock_seeker';


export class MockUser extends User {
    confirmCount: number = 0;
    confirmResult: boolean = false;
    confirmWillThrow: boolean = false;

    constructor(public id: string, public password: string) {
        super(defaultMockCaller, defaultMockFetcher, defaultMockSeeker);
        this.init(id, password);
    }

    confirm(callback?: { (error: Error, res: boolean): void; }): Observable<boolean> {
        this.confirmCount++;
        var observable = Observable.create<boolean>((observer) => {
            if (!this.confirmWillThrow) {
                observer.onNext(this.confirmResult);
                observer.onCompleted();
            }
            else {
                observer.onError(new Error('999: Fake error.'))
            }
        });
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
}


export class MockUserFactory extends UserFactory {
    constructor() {
        super(defaultMockCaller, defaultMockFetcher, defaultMockSeeker);
    }

    create(id: string, password: string): MockUser {
        return new MockUser(id, password);
    }
}

export const defaultMockUserFactory: MockUserFactory = new MockUserFactory();
