export class Score {
    id: string = null;

    constructor(id: string) {
        this.id = id;
    }
}

export class ScoreFactory {
    create(id: string): Score {
        return new Score(id);
    }
}
