///<reference path="../typings/lodash/lodash"/>
///<reference path="../typings/rx/rx"/>
///<reference path="../typings/rx/rx-lite"/>

import { Initialize } from './utils/initialize';
import { Injector, injector } from './helpers/injector';

Initialize.init(injector);

import * as _ from 'lodash';
import { Observable } from 'rx';

import { Course, CourseFactory } from './models/course';
import { Exception, ExceptionFactory } from './models/exception';
import { User, UserFactory } from './models/user';
import { Person, PersonFactory } from './models/person';

import { Cacher } from './helpers/cacher';
import { Caller } from './helpers/caller';
import { Fetcher } from './helpers/fetcher';
import { Seeker } from './helpers/seeker';

import { ISearchCoursesOption, ISearchPeopleOption } from './utils/interfaces';


var cacher: Cacher = injector.get('Cacher');
var caller: Caller = injector.get('Caller');
var fetcher: Fetcher = injector.get('Fetcher');
var seeker: Seeker = injector.get('Seeker');

var userFactory: UserFactory = injector.get('UserFactory');
var exceptionFactory: ExceptionFactory = injector.get('ExceptionFactory');

/** 
 * @class
 * Represents an instance of SDK application.
 */
export class Application {
    private currentUser: User;
    
    /**
     * @constructor
     * The constructor of Application class.
     */
    constructor () {
        this.currentUser = _.find(cacher.users, (user) => user.isConfirmed) || null;
    }
    
    getInjector (): Injector {
        return injector;
    }
    
    one (id: string): User {
        return cacher.users[id] || null;
    }

    register (id: string, password: string): User {
        var user: User;
        cacher.users[id] = user = userFactory.$new(id, password);
        
        if(!this.isUserExist()) {
            user.confirm().subscribe(() => this.currentUser = user);
        }
        return user;
    }
    
    searchForCourses (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {       
        var observable = Observable.create<Course[]>((observer) => {
            if(!this.isUserExist()) {
                observer.onError(exceptionFactory.$new(401, 'Application#searchForCourses must be called with a current user.'));
            }
        }).merge(fetcher.searchForCourses(option));
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    searchForCoursesInCache (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = seeker.searchForCourses(option);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    searchForCoursesWithCache (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = this.searchForCourses(option)
            .catch(this.searchForCoursesInCache(option)); 
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    searchForPeople (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {       
        var observable = Observable.create<Person[]>((observer) => {
            if(!this.isUserExist()) {
                observer.onError(exceptionFactory.$new(401, 'Application#searchForPeople must be called with a current user.'));
            }
        }).merge(fetcher.searchForPeople(option));
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    searchForPeopleInCache (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = seeker.searchForPeople(option);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    searchForPeopleWithCache (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = this.searchForPeople(option)
            .catch(this.searchForPeopleInCache(option));   
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    verify (id: string, password: string, callback?: { (error: Error, result: boolean): void; }): Observable<boolean> {
        var user = new User(id, password);
        var observable = user.confirm();
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    private isUserExist (): boolean {
        return !!this.currentUser;
    }
}

export const app: Application = new Application();
