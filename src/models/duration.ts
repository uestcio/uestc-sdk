export class Duration {
    weeks: string = null;
    indexes: string = null;
    day: number = null;
    place: string = null;

    constructor() {

    }
}

export class DurationFactory {
    create() {
        return new Duration();
    }
}

export const defaultDurationFactory: DurationFactory = new DurationFactory();
