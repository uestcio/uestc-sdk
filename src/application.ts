///<reference path="../typings/es6-promise/es6-promise"/>
///<reference path="../typings/lodash/lodash"/>
///<reference path="../typings/rx/rx"/>
///<reference path="../typings/rx/rx-lite"/>

import { Promise } from 'es6-promise';
import * as _ from 'lodash';
import { Observable } from 'rx';

import { Course } from './models/course';
import { Error } from './models/error';
import { Notice } from './models/notice';
import { Person } from './models/person';
import { User } from './models/user';

import { Caller } from './helpers/caller';
import { Cacher } from './helpers/cacher';
import { Fetcher } from './helpers/fetcher';
import { Seeker } from './helpers/seeker';

import { ISearchCoursesOption, ISearchPeopleOption } from './utils/interfaces';

export class Application {
    private currentUser: User;

    constructor () {
        this.reset();
    }
    
    one (id: string): User {
        return Cacher.users[id] || null;
    }

    register (id: string, password: string): User {
        var user;
        Cacher.users[id] = user = new User(id, password);
        
        if(!this.isUserExist()) {
            user.confirm().subscribe(() => this.currentUser = user);
        }
        
        return user;
    }
    
    reset (): void {
        this.currentUser = _.find(Cacher.users, (user) => user.isConfirmed) || null;
    }
    
    searchForCourses (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {       
        var observable = Observable.create<Course[]>((observer) => {
            if(!this.isUserExist()) {
                observer.onError(new Error(403, 'Cannot search courses without a login user.'));
            }
        }).merge(Fetcher.searchForCourses(option));
        
        if (_.isFunction(callback)) {
            Caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForCoursesInCache (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = Seeker.searchForCourses(option);
        
        if (_.isFunction(callback)) {
            Caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForCoursesWithCache (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = this.searchForCourses(option)
            .catch(this.searchForCoursesInCache(option));
            
        if (_.isFunction(callback)) {
            Caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeople (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {       
        var observable = Observable.create<Person[]>((observer) => {
            if(!this.isUserExist()) {
                observer.onError(new Error(403, 'Cannot search people without a login user.'));
            }
        }).merge(Fetcher.searchForPeople(option));
        
        if (_.isFunction(callback)) {
            Caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeopleInCache (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = Seeker.searchForPeople(option);
        
        if (_.isFunction(callback)) {
            Caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeopleWithCache (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = this.searchForPeople(option)
            .catch(this.searchForPeopleInCache(option));
            
        if (_.isFunction(callback)) {
            Caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    verify (id: string, password: string): Observable<User> {
        var user = new User(id, password);
        return user.confirm();
    }
    
    private isUserExist (): boolean {
        return !!this.currentUser;
    }
}

export const app: Application = new Application();
