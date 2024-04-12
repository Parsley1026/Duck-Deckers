export class Card {
    constructor(name, number, id) {
        this.name = name;
        this.number = number;
        this.id = id;
    }

    toString() {
        return this.name + " " + this.number + " " + this.id;
    }
}

export class Duck extends Card {
    constructor(name, number, id, health, damage, abilities) {
        super(name, number, id);
        this.health = health;
        this.damage = damage;
        this.abilities = abilities;
    }
}

export class Spell extends Card {
    constructor(name, number, id, effect){
        super(name, number, id);
        this.effect = effect;
    }
}

export class Land extends Card {
    constructor(name, number, id, effect){
        super(name, number, id);
        this.effect = effect;
    }
}