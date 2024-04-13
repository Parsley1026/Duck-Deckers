export class Card {
    constructor(id, name, cost) {
        this.id = id;
        this.name = name;
        this.cost = cost;
    }

    toString() {
        return "id: " + this.id +
            "\nname: " + this.name +
            "\ncost: " + this.cost;
    }
}

export class Duck extends Card { //identified as card type 0
    constructor(id, name, cost, effect, strength, damage, health) {
        super(id, name, cost);
        this.effect = effect;
        this.strength = strength;
        this.damage = damage;
        this.health = health;
    }

    toString(){
        return super.toString() +
            "\neffect: " + this.effect +
            "\nstrength: " + this.strength +
            "\ndamage: " + this.damage +
            "\nhealth: " + this.health;
    }
}

export class Spell extends Card { //identified as card type 1
    constructor(id, name, cost, effect, strength){
        super(id, name, cost);
        this.effect = effect;
        this.strength = strength; //strength of effect (aka: draw "strength" amount of cards)
        /*
            effect coding for spells: (may have to be an array for certain cards
            0: freeze
            1: heal
            2: draw
            3: damage
            4: destroy
            5: awaken (un-tap)
            6: wipe (destroy land)
         */
    }

    toString() {
        return super.toString() +
            "\neffect: " + this.effect +
            "\nstrength: " + this.strength;
    }
}

export class Land extends Card { //identified as card type 2
    constructor(id, name, cost, effect, strength){
        super(id, name, cost);
        this.effect = effect;
        this.strength = strength;
    }

    toString() {
        return super.toString() +
            "\neffect: " + this.effect +
            "\nstrength: " + this.strength;
    }
}