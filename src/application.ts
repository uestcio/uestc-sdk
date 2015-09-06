///<reference path="../typings/es6-promise/es6-promise"/>
///<reference path="../typings/lodash/lodash"/>
///<reference path="../typings/rx/rx"/>
///<reference path="../typings/rx/rx-lite"/>

import { Promise } from 'es6-promise';
import * as _ from 'lodash';
import { Observable } from 'rx';

import { Course, CourseFactory } from './models/course';
import { Exception, ExceptionFactory } from './models/exception';
import { User, UserFactory } from './models/user';
import { Person, PersonFactory } from './models/person';

import { Cacher } from './helpers/cacher';
import { Caller } from './helpers/caller';
import { Fetcher } from './helpers/fetcher';
import { Injector, injector } from './helpers/injector';
import { Seeker } from './helpers/seeker';

import { Initialize } from './utils/initialize';
import { ISearchCoursesOption, ISearchPeopleOption } from './utils/interfaces';



export class Application {
    private currentUser: User;
    
    private cacher: Cacher;
    private caller: Caller;
    private fetcher: Fetcher;
    private seeker: Seeker;
    
    private userFactory: UserFactory;
    private exceptionFactory: ExceptionFactory;
    

    constructor () {
        Initialize.init(injector);
        
        this.cacher = injector.get('Cacher');
        this.caller = injector.get('Caller');
        this.fetcher = injector.get('Fetcher');
        this.seeker = injector.get('Seeker');
        
        this.userFactory = injector.get('UserFactory');
        this.exceptionFactory = injector.get('ExceptionFactory');
        
        this.currentUser = _.find(this.cacher.users, (user) => user.isConfirmed) || null;
    }
    
    getInjector (): Injector {
        return injector;
    }
    
    one (id: string): User {
        return this.cacher.users[id] || null;
    }

    register (id: string, password: string): User {
        var user: User;
        this.cacher.users[id] = user = this.userFactory.$new(id, password);
        
        if(!this.isUserExist()) {
            user.confirm().subscribe(() => this.currentUser = user);
        }
        
        return user;
    }
    
    searchForCourses (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {       
        var observable = Observable.create<Course[]>((observer) => {
            if(!this.isUserExist()) {
                observer.onError(this.exceptionFactory.$new(401, 'Application#searchForCourses must be called with a current user.'));
            }
        }).merge(this.fetcher.searchForCourses(option));
        
        if (_.isFunction(callback)) {
            this.caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForCoursesInCache (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = this.seeker.searchForCourses(option);
        
        if (_.isFunction(callback)) {
            this.caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForCoursesWithCache (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = this.searchForCourses(option)
            .catch(this.searchForCoursesInCache(option));
            
        if (_.isFunction(callback)) {
            this.caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeople (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {       
        var observable = Observable.create<Person[]>((observer) => {
            if(!this.isUserExist()) {
                observer.onError(this.exceptionFactory.$new(401, 'Application#searchForPeople must be called with a current user.'));
            }
        }).merge(this.fetcher.searchForPeople(option));
        
        if (_.isFunction(callback)) {
            this.caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeopleInCache (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = this.seeker.searchForPeople(option);
        
        if (_.isFunction(callback)) {
            this.caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeopleWithCache (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = this.searchForPeople(option)
            .catch(this.searchForPeopleInCache(option));
            
        if (_.isFunction(callback)) {
            this.caller.nodifyObservable(observable, callback);
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
