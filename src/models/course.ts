export class Course {
    id: string;
}

export class CourseFactory {
    $new () {
        return new Course();
    }
}
