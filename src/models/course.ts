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
    
    constructor (id: string) {
        this.id = id;
        this.code = id.indexOf('.') > 0? id.split('.')[0]: null;
    }
}

export class TakenCourse extends Course {
    
}

export class CourseFactory {
    create (id: string) {
        return new Course(id);
    }
}

export const courseFactory: CourseFactory = new CourseFactory();
