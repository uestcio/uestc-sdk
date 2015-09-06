export class Course {
    id: string;
    
    constructor (id: string) {
        this.id = id;
    }
}

export class TakenCourse extends Course {
    
}

export class CourseFactory {
    $new (id: string) {
        return new Course(id);
    }
}
