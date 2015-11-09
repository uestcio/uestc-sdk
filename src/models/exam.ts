export class Exam {
    id: string = null;

    constructor(id: string) {
        this.id = id;
    }
}

export class ExamFactory {
    create(id: string): Exam {
        return new Exam(id);
    }
}
