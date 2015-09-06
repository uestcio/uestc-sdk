///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';


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
