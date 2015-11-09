/// <reference path="../../../typings/rx/rx"/>


import { Observable } from 'rx';

import { Fetcher } from '../../../src/helpers/fetcher';
import { Course } from '../../../src/models/course';
import { Person } from '../../../src/models/person';

import { IGetUserCoursesOption, ISearchCoursesOption } from '../../../src/utils/course_util';
import { ISearchPeopleOption } from '../../../src/utils/person_util';
import { IUserDetail, IUserLogin } from '../../../src/utils/user_util';


export class MockFetcher extends Fetcher {
    constructor(public courses?: Course[], public people?: Person[]) {
        super();
    }
    
    searchForCourses(option: ISearchCoursesOption, user: IUserLogin): Observable<Course[]> {
        return Observable.return(this.courses);
    }
    
    searchForPeople(option: ISearchPeopleOption, user: IUserLogin): Observable<Person[]> {
        return Observable.return(this.people);
    }
}

export const defaultMockFetcher = new MockFetcher();
