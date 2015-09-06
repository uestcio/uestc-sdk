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


Initialize.init(injector);

var cacher: Cacher = injector.get('Cacher');
var caller: Caller = injector.get('Caller');
var fetcher: Fetcher = injector.get('Fetcher');
var seeker: Seeker = injector.get('Seeker');

var userFactory: UserFactory = injector.get('UserFactory');
var exceptionFactory: ExceptionFactory = injector.get('ExceptionFactory');

export class Application {
    private currentUser: User;
    
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
        
        if (_.isFunction(callback)) {
            caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForCoursesInCache (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = seeker.searchForCourses(option);
        
        if (_.isFunction(callback)) {
            caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForCoursesWithCache (option: ISearchCoursesOption, callback?: { (error: Error, courses: Course[]): void; }): Observable<Course[]> {
        var observable = this.searchForCourses(option)
            .catch(this.searchForCoursesInCache(option));
            
        if (_.isFunction(callback)) {
            caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeople (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {       
        var observable = Observable.create<Person[]>((observer) => {
            if(!this.isUserExist()) {
                observer.onError(exceptionFactory.$new(401, 'Application#searchForPeople must be called with a current user.'));
            }
        }).merge(fetcher.searchForPeople(option));
        
        if (_.isFunction(callback)) {
            caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeopleInCache (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = seeker.searchForPeople(option);
        
        if (_.isFunction(callback)) {
            caller.nodifyObservable(observable, callback);
        }
        
        return observable;
    }
    
    searchForPeopleWithCache (option: ISearchPeopleOption, callback?: { (error: Error, people: Person[]): void; }): Observable<Person[]> {
        var observable = this.searchForPeople(option)
            .catch(this.searchForPeopleInCache(option));
            
        if (_.isFunction(callback)) {
            caller.nodifyObservable(observable, callback);
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
