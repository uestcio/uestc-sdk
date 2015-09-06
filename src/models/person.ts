export class Person {
    id: string;
}

export class PersonFactory {
    $new () {
        return new Person();
    }
}
