///<reference path="../typings/lodash/lodash"/>
///<reference path="../typings/rx/rx"/>
///<reference path="../typings/rx/rx-lite"/>
///<reference path="../typings/request/request"/>


import * as _ from 'lodash';
import * as Request from 'request';
import { Observable } from 'rx';

import { Course } from './models/course';
import { User, UserFactory, defaultUserFactory } from './models/user';
import { Person, PersonFactory } from './models/person';

import { Cacher, defaultCacher } from './helpers/cacher';
import { Caller, defaultCaller } from './helpers/caller';
import { Fetcher, defaultFetcher } from './helpers/fetcher';
import { Seeker, defaultSeeker } from './helpers/seeker';

import { ISearchCoursesOption } from './utils/course_util';
import { ISearchPeopleOption } from './utils/person_util';


/** 
* @description Represents an portal of SDK library.
*/
export class Application {
    
    /**
    * @description The user instance for application global operations.
    */
    private _currentUser: User = null;

    get currentUser(): User {
        return this._currentUser;
    }
    
    /**
    * @description The constructor of Application class.
    */
    constructor(private userFactory: UserFactory, private cacher: Cacher, private caller: Caller, private fetcher: Fetcher, private seeker: Seeker) {
        this.currentUser = _.find(cacher.users, (user) => user.isConfirmed) || null;
    }
    
    /**
    * @description Get the exact user of given student id which has been registered before.
    * @param id The student id of the student.
    * @returns The student instance if exist, null if not.
    */
    one(id: string): User {
        return this.cacher.users[id] || null;
    }

    /**
    * @description Register a student entity with student id and password.
    * @param id The student id of the student.
    * @param password The password of the UESTC Portal site.
    * @returns The student instance of the given student id.
    */
    register(id: string, password: string): User {
        var user: User;
        this.cacher.users[id] = user = this.userFactory.create(id, password);

        if (!this.isUserExist()) {
            this._currentUser = user;
        }

        user.confirm().subscribe((res) => {
            this._currentUser = user;
        }, (error) => {

        });

        return user;
    }
    
    /**
    * @description Search for courses that satisfy the given option online.
    * @param option The option of the search.
    * @param callback The callback function to be called with an error or the result of courses if don't want to use the Observable operations. It's deprecated.
    * @returns The Observable instance of the search result.
    */
    searchForCourses(option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable: Observable<Course[]> = Observable.just<boolean>(this.isUserExist())
            .flatMap<Course[]>((x) => x ?
                this.fetcher.searchForCourses(option, this.currentUser) :
                Observable.throw<Course[]>(new Error('401: Application#searchForCourses must be called with a current user.')));
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
    * @description Search for courses that satisfy the given option offline.
    * @param option The option of the search.
    * @param callback The callback function to be called with an error or the result of courses ifor users unfamiliar with Rx. It's deprecated.
    * @returns The Observable instance of the search result.
    */
    searchForCoursesInCache(option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = this.seeker.searchForCourses(option);
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
    * @description Search for courses that satisfy the given option online when possible, offline when necessary.
    * @param option The option of the search.
    * @param callback The callback function to be called with an error or the result of courses for users unfamiliar with Rx. It's deprecated.
    * @returns The Observable instance of the search result.
    */
    searchForCoursesWithCache(option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = this.searchForCourses(option)
            .catch(this.searchForCoursesInCache(option));
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
    * @description Search for people that satisfy the given option online.
    * @param option The option of the search.
    * @param callback The callback function to be called with an error or the result of people for users unfamiliar with Rx. It's deprecated.
    * @returns The Observable instance of the search result.
    */
    searchForPeople(option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable: Observable<Person[]> = Observable.just<boolean>(this.isUserExist())
            .flatMap<Person[]>((x) => x ?
                this.fetcher.searchForPeople(option, this.currentUser) :
                Observable.throw<Person[]>(new Error('401: Application#searchForCourses must be called with a current user.')));
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
    * @description Search for people that satisfy the given option offline.
    * @param option The option of the search.
    * @param callback The callback function to be called with an error or the result of people for users unfamiliar with Rx. It's deprecated.
    * @returns The Observable instance of the search result.
    */
    searchForPeopleInCache(option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = this.seeker.searchForPeople(option);
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
    * @description Search for people that satisfy the given option online when possible, offline when necessary.
    * @param option The option of the search.
    * @param callback The callback function to be called with an error or the result of people for users unfamiliar with Rx. It's deprecated.
    * @returns The Observable instance of the search result.
    */
    searchForPeopleWithCache(option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = this.searchForPeople(option)
            .catch(this.searchForPeopleInCache(option));
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
    * @description Verify whether the given student id and password is valid. 
    * @notice If some other accident occurs (i.e. No network), the result would be null, please do check whether the error exists or not.
    * @param id The student id of the student.
    * @param password The password of the student.
    * @param callback The callback function to be called with an error or the result of verify for users unfamiliar with Rx. It's deprecated.
    * @returns The boolean result of valid or not. 
    */
    verify(id: string, password: string, callback?: { (error: Error, result: boolean): void; }): Observable<boolean> {
        var user = this.userFactory.create(id, password);
        var observable = user.confirm();
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
    * @description Check whether there is a user to deal with global operation.
    * @returns The boolean result of exist or not.
    */
    private isUserExist(): boolean {
        return !!(this.currentUser);
    }
}

/**
* @description The Application instance for access.
*/
export const defaultApplication: Application = new Application(defaultUserFactory, defaultCacher, defaultCaller, defaultFetcher, defaultSeeker);
