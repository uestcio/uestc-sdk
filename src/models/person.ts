export class Person {
    id: string;
    
    constructor (id: string) {
        this.id = id;
    }
}

export class PersonFactory {
    $new (id: string) {
        return new Person(id);
    }
}
