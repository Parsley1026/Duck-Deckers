export class Card {
    constructor(id, name, cost) {
        this.id = id;
        this.name = name;
        this.cost = cost;
    }
    toString() {
        return `id: ${this.id}\nname: ${this.name}\ncost: ${this.cost}`;
    }

}

export class Duck extends Card { //identified as card type 0
    constructor(id, name, cost, effect, damage, health) {
        super(id, name, cost);
        this.effect = effect; //format for effect is an array, [effect #, effect strength]
        /*
            effect coding for ducks:
                (for cards with multiple effects, type #'s into one line)
                Example for card with freeze 1 and heal 4, effect var would be [[0, 1], [1, 4]]
            0: Income (on tap)
            1: adjacent buff (passive)
            2: damage on play
            3: Get rare or above duck
            4: on death damage
            5: income on duck play
            6: discount spell (passive)
            7: not effected by spells
            8: selective buff (on tap)
            9: adjacent damage
            10: trample
            11: untapped on play
         */
        this.damage = damage;
        this.health = health;
    }

    toString(){
        if(this.effect == null) {
            return `${super.toString()}\neffect: null\nstrength: null\ndamage: ${this.damage}\nhealth: ${this.health}`;
        } else if(this.effect.every(entry => !Array.isArray(entry))) {
            return `${super.toString()}\neffect: ${this.effect[0]}\nstrength: ${this.effect[1]}\ndamage: ${this.damage}\nhealth: ${this.health}`;
        } else {
            const arrLen = this.effect.length;
            let retString = super.toString();
            for(let i = 0; i < arrLen; i++) {
                retString += `\neffect ${i + 1}: ${this.effect[i][0]}\nstrength ${i + 1}: ${this.effect[i][1]}`;
            }
            retString += `\ndamage: ${this.damage}\nhealth: ${this.health}`;
            return retString;
        }
    }

}

export class Spell extends Card { //identified as card type 1
    constructor(id, name, cost, effect){
        super(id, name, cost);
        this.effect = effect; //format for effect is an array, [effect #, effect strength]
        /*
            effect coding for spells:
                (for cards with multiple effects, type #'s into one line)
                Example for card with freeze 1 and heal 4, effect var would be [[0, 1], [1, 4]]
            0: freeze
            1: heal
            2: draw
            3: damage
            4: destroy
            5: awaken (un-tap)
            6: wipe (destroy land)
            7: buff (negative number buffs just attack)
            8: Buff for one round and then kill
            9: manquacken project (EFFECT IS IN HAND)
            10: damage all foes
         */
    }

    toString() {
        if(this.effect == null) {
            return `${super.toString()}\neffect: null\nstrength: null`;
        } else if(this.effect.every(entry => !Array.isArray(entry))) {
            return `${super.toString()}\neffect: ${this.effect[0]}\nstrength: ${this.effect[1]}`;
        } else {
            const arrLen = this.effect.length;
            let retString = super.toString();
            for(let i = 0; i < arrLen; i++) {
                retString += `\neffect ${i + 1}: ${this.effect[i][0]}\nstrength ${i + 1}: ${this.effect[i][1]}`;
            }
            return retString;
        }
    }
}

export class Land extends Card { //identified as card type 2
    constructor(id, name, cost, effect){
        super(id, name, cost);
        this.effect = effect; //format for effect is an array, [effect #, effect strength]
        /*
            effect coding for land:
                (for cards with multiple effects, type #'s into one line)
                Example for card with freeze 1 and heal 4, effect var would be [[0, 1], [1, 4]]
            0: tempered (reduces incoming damage by strength)
            1: damage on foe play
            2: income on round start (Factory)
         */
    }

    toString() {
        if(this.effect == null) {
            return `${super.toString()}\neffect: null\nstrength: null`;
        } else if(this.effect.every(entry => !Array.isArray(entry))) {
            return `${super.toString()}\neffect: ${this.effect[0]}\nstrength: ${this.effect[1]}`;
        } else {
            const arrLen = this.effect.length;
            let retString = super.toString();
            for(let i = 0; i < arrLen; i++) {
                retString += `\neffect ${i + 1}: ${this.effect[i][0]}\nstrength ${i + 1}: ${this.effect[i][1]}`;
            }
            return retString;
        }
    }
}
