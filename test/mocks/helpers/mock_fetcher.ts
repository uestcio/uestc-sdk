/// <reference path="../../../typings/rx/rx"/>


import { Observable } from 'rx';

import { Fetcher } from '../../../src/helpers/fetcher';
import { Course, TakenCourse } from '../../../src/models/course';
import { Person } from '../../../src/models/person';

import { IGetUserCoursesOption, ISearchCoursesOption } from '../../../src/utils/course_util';
import { ISearchPeopleOption } from '../../../src/utils/person_util';
import { IUserDetail, IUserLogin } from '../../../src/utils/user_util';


export class MockFetcher extends Fetcher {
    courses: Course[];
    people: Person[];
    
    confirmCount: number = 0;
    confirmResult: boolean = false;
    confirmWillThrow: boolean = false;
    infoCount: number = 0;
    infoResult: IUserDetail;
    infoWillThrow: boolean = false;

    constructor() {
        super();
    }

    confirmUser(user: IUserLogin): Observable<boolean> {
        if (!this.confirmWillThrow) {
            this.confirmCount++;
            return Observable.return(this.confirmResult);
        }
        else {
            return Observable.throw<boolean>(new Error('999: Fake Error.'));
        }
    }

    getUserCourses(option: IGetUserCoursesOption, forever: boolean, user: IUserLogin): Observable<TakenCourse[]> {
        if (!forever) {
            return Observable.return(<TakenCourse[]>this.courses);
        }
        else {
            return Observable.from<TakenCourse[]>([this.courses.slice(0, 1), this.courses.slice(0, 2), this.courses.slice(0, 3)]);
        }
    }

    getUserInfo(user: IUserLogin): Observable<IUserDetail> {
        if (!this.infoWillThrow) {
            this.infoCount++;
            return Observable.return(this.infoResult);
        }
        else {
            return Observable.throw<IUserDetail>(new Error('999: Fake Error.'));
        }
    }

    searchForCourses(option: ISearchCoursesOption, user: IUserLogin): Observable<Course[]> {
        return Observable.return(this.courses);
    }

    searchForPeople(option: ISearchPeopleOption, user: IUserLogin): Observable<Person[]> {
        return Observable.return(this.people);
    }
}

export const defaultMockFetcher = new MockFetcher();
