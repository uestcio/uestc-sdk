///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { CookieJar } from 'request';
import { Observable } from 'rx';

export interface ISearchCoursesOption {
    name?: string,
    department?: string,
    instructor?: string,
    grade?: string,
    type?: string
}

export interface IGetSemesterCoursesOption {
    semester: string
}

export interface IGetUserCoursesOption {
    grade?: number,
    semester?: number
}
