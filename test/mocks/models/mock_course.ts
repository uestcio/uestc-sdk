import { Course, CourseFactory } from '../../../src/models/course';


export class MockCourse extends Course {
    
}

export class MockCourseFactory extends CourseFactory {
    
}

export const defaultMockCourseFactory = new MockCourseFactory();
