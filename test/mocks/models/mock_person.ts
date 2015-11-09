import { Person, PersonFactory } from '../../../src/models/person';


export class MockPerson extends Person {
    
}

export class MockPersonFactory extends PersonFactory {
    
}

export const defaultMockPersonFactory = new MockPersonFactory();
