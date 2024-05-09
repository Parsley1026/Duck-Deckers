export class Card {
    constructor(id, name, cost, type) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.type = type;
    }
    toString() {
        return `id: ${this.id}\nname: ${this.name}\ncost: ${this.cost}`;
    }

}

export class Duck extends Card { //identified as card type 0
    constructor(id, name, cost, type, effect, damage, health, stamina) {
        super(id, name, cost, type);
        this.effect = effect; //format for effect is an array, [effect #, effect strength]
        /*
            effect coding for ducks:
                (for cards with multiple effects, type #'s into one line)
                Example for card with freeze 1 and heal 4, effect var would be [[0, 1], [1, 4]]
            0: Income (on tap)
                        if player1 and in B slot
                            player1 emeralds++
                            exhaust this
                        if player2 and in A slot
                            player2 emeralds++
                            exhaust this
            1: adjacent buff
            2: damage on play
                when played
                prompt user to select target
                reference attack function pass in the second number
            3: random card (maybe)
            4: on death damage
                //on health change
                    //if this.getHealth<1

            5: income on duck play
            6: discount spell (passive) (negative # makes enemy spells more expensive)
            7: not effected by spells
            8: selective buff (on tap)
            9: adjacent damage
            10: trample
            11: untapped on play
            12: discount duck (passive)
            13: When this kills a foe, buff
            14: damage all foes when played
         */
        this.damage = damage;
        this.health = health;
        this.stamina = stamina;
        /*
            2: summoning sickness
            1: tapped
            0: un-exhausted
         */
    }

    toString(){
        if(this.effect == null) {
            return `${super.toString()}\neffect: null\nstrength: null\ndamage: ${this.damage}\nhealth: ${this.health}\nstamina: ${this.stamina}`;
        } else if(this.effect.every(entry => !Array.isArray(entry))) {
            return `${super.toString()}\neffect: ${this.effect[0]}\nstrength: ${this.effect[1]}\ndamage: ${this.damage}\nhealth: ${this.health}\nstamina: ${this.stamina}`;
        } else {
            const arrLen = this.effect.length;
            let retString = super.toString();
            for(let i = 0; i < arrLen; i++) {
                retString += `\neffect ${i + 1}: ${this.effect[i][0]}\nstrength ${i + 1}: ${this.effect[i][1]}`;
            }
            retString += `\ndamage: ${this.damage}\nhealth: ${this.health}\nstamina: ${this.stamina}`;
            return retString;
        }
    }
    abiltyTap(){
        switch(this.id){
            case 4:
                return [this.effect]; //game.js will interpret this as adding 1 emerald to player
            case 8:
                return [this.effect]; //game.js will interpret this as buffing a card
        }
    }
    abilityOnPlay(){
        switch(this.id){
            case 1:
                return [this.effect];
            case 2:
                return [this.effect];
            case 3:
                return [this.effect];
            case 11:
                return [this.effect];
            case 14:
                return [this.effect];
        }
    }
    abilityOnDeath(){
        switch(this.id){
            case 1:
                return [this.effect];
        }
    }

    attack(enemyCard){
        enemyCard.health -= this.damage;
        this.stamina = 1;
    }


}

export class Spell extends Card { //identified as card type 1
    constructor(id, name, cost, type, effect){
        super(id, name, cost, type);
        this.effect = effect; //format for effect is an array, [effect #, effect strength]
        /*
            effect coding for spells:
                (for cards with multiple effects, type #'s into one line)
                Example for card with freeze 1 and heal 4, effect var would be [[0, 1], [1, 4]]
            0: freeze
            1: heal
                increase target health by strength
                    if health > max health
                        health = max health
            2: draw
            3: damage
            4: destroy
            5: awaken (un-tap)
            6: wipe (destroy land)
            7: buff (negative number buffs just attack)
            8: Buff for one round and then kill
            9: manquacken project (EFFECT IS IN HAND)
            10: damage all foes
            11: destroy foes with attack # or less
            12: income on play
            13: discard upon play
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
    constructor(id, name, cost, type, effect){
        super(id, name, cost, type);
        this.effect = effect; //format for effect is an array, [effect #, effect strength]
        /*
            effect coding for land:
                (for cards with multiple effects, type #'s into one line)
                Example for card with freeze 1 and heal 4, effect var would be [[0, 1], [1, 4]]
            0: tempered (reduces incoming damage by strength)
            1: damage on foe play
                    if you are player1 and B slot is updated
                        do 1 damage
                    if you are player2 and A slot is updated
                        do 1 damage
            2: your ducks enter untapped
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
