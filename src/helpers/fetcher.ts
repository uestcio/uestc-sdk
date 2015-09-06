///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { Course, TakenCourse } from '../models/course';
import { Person } from '../models/person';

import { ISearchCoursesOption, ISearchPeopleOption, IGetUserCoursesOption } from 'utils/interfaces';

export class Fetcher {
    confirmUser (id: string, password: string): Observable<boolean> {
        return null;
    }
    
    getUserCourses (option: IGetUserCoursesOption, once: boolean = true) : Observable<TakenCourse[]> {
        return null;
    }
    
    searchForCourses (option: ISearchCoursesOption): Observable<Course[]> {
        return null;
    }
    
    searchForPeople (option: ISearchPeopleOption): Observable<Person[]> {
        return null;
    }
}
