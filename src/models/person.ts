export class Person {
    id: string;
    name: string;
    deptName: string;
    
    constructor (id: string) {
        this.id = id;
    }
}

export class PersonFactory {
    create (id: string) {
        return new Person(id);
    }
}

export const personFactory = new PersonFactory();
