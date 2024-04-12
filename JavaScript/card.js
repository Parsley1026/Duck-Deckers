export class Card {
    constructor(name, number) {
        this.name = name;
        this.number = number;
    }

    toString() {
        return this.name + " " + this.number;
    }
}