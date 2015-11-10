/// <reference path="../../../typings/rx/rx"/>


import { Observable } from 'rx';

import { Seeker } from '../../../src/helpers/seeker';
import { Course, TakenCourse } from '../../../src/models/course';
import { Person } from '../../../src/models/person';

import { IGetUserCoursesOption, ISearchCoursesOption } from '../../../src/utils/course_util';
import { ISearchPeopleOption } from '../../../src/utils/person_util';

export class MockSeeker extends Seeker {
    constructor(public courses?: Course[], public people?: Person[]) {
        super();
    }
    
    getUserCourses(option: IGetUserCoursesOption): Observable<TakenCourse[]> {
        return Observable.return(this.courses);
    }
    
    searchForCourses(option: ISearchCoursesOption): Observable<Course[]> {
        return Observable.return(this.courses);
    }
    
    searchForPeople(option: ISearchPeopleOption): Observable<Person[]> {
        return Observable.return(this.people);
    }
}

export const defaultMockSeeker = new MockSeeker();
