import { Course, TakenCourse, CourseFactory, TakenCourseFactory } from '../../../src/models/course';


export class MockCourse extends Course {
    
}

export class MockTakenCourse extends TakenCourse {
    
}


export class MockCourseFactory extends CourseFactory {
    
}

export const defaultMockCourseFactory = new MockCourseFactory();


export class MockTakenCourseFactory extends TakenCourseFactory {
    
}

export const defaultMockTakenCourseFactory = new MockTakenCourseFactory();
