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

export interface IUserDetail {
    administrationClass: string,
    administrationCollege: string,
    campus: string,
    college: string,
    dateFrom: Date,
    dateTo: Date,
    direction: string,
    educationType: string,
    englishName: string,
    gender: string,
    grade: number,
    id: string,
    inEnrollment: boolean,
    inSchool: boolean,
    major: string,
    name: string,
    project: string,
    qualification: string,
    schoolingLength: number,
    status: string,
    studyType: string,
    genre: string
}
