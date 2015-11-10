///<reference path="../../typings/request/request"/>


import { CookieJar } from 'request';


export interface IUserDetail {
    administrationClass?: string,
    administrationCollege?: string,
    campus?: string,
    college?: string,
    dateFrom?: Date,
    dateTo?: Date,
    direction?: string,
    educationType?: string,
    englishName?: string,
    gender?: string,
    grade?: number,
    id: string,
    inEnrollment?: boolean,
    inSchool?: boolean,
    major?: string,
    name: string,
    project?: string,
    qualification?: string,
    schoolingLength?: number,
    status?: string,
    studyType?: string,
    genre?: string
}

export interface IUserLogin {
    id: string,
    password: string,
    jar: CookieJar
}
