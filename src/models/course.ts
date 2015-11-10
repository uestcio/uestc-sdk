import { Exam } from './exam';
import { Score } from './score';

export class Course {
    id: string = null;
    campus: string = null;
    code: string = null;
    credit: number = null;
    department: string = null;
    durations: any[] = [];
    genre: string = null;
    instructors: string[] = [];
    title: string = null;

    constructor(id: string) {
        this.id = id;
        this.code = id.indexOf('.') > 0 ? id.split('.')[0] : null;
    }
}

export class TakenCourse extends Course {
    exam: Exam = null;
    score: Score = null;
}

export class CourseFactory {
    create(id: string) {
        return new Course(id);
    }
}

export const defaultCourseFactory: CourseFactory = new CourseFactory();


export class TakenCourseFactory {
    create(id: string) {
        return new TakenCourse(id);
    }
}

export const defaultTakenCourseFactory: TakenCourseFactory = new TakenCourseFactory();
