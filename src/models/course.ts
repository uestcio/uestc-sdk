export class Course {
    id: string = null;
    campus: string = null;
    department: string = null;
    durations: any[] = [];
    genre: string = null;
    instructors: string[] = [];
    title: string = null;  
    
    constructor (id: string) {
        this.id = id;
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
