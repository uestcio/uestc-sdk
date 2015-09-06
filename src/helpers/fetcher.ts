///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { Course } from '../models/course';
import { Person } from '../models/person';

import { ISearchCoursesOption, ISearchPeopleOption } from 'utils/interfaces';

export class Fetcher {
    searchForCourses (option: ISearchCoursesOption): Observable<Course[]> {
        return null;
    }
    
    searchForPeople (option: ISearchPeopleOption): Observable<Person[]> {
        return null;
    }
}