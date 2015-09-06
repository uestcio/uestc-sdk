///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';


export interface IGetUserCoursesOption {
    grade?: number,
    semester?: number
}

export interface ISearchCoursesOption { 
    name?: string, 
    department?: string, 
    instructor?: string, 
    grade?: string, 
    type?: string 
}

export interface ISearchPeopleOption {
    term?: string
}
