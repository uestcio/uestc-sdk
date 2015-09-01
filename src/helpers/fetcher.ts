///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { Course } from '../models/course';

import { ISearchCoursesOption, ISearchPeopleOption } from '../utils/interfaces';

export class Fetcher {
    static searchForCourses (option: ISearchCoursesOption): Observable<Course[]> {
        return null;
    }
    
    static searchForPeople (option: ISearchPeopleOption): Observable<Person[]> {
        return null;
    }
}
