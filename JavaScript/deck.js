import { Duck, Spell, Land } from "./card.js";
import { createCard } from "./cardCreation.js";

export class Deck{
    constructor(cards){
        this.cards = cards;
    }

    toString() {
        let retString = "";
        for(let i = 0; i < this.cards.length; i++){
            retString += `${this.cards[i].toString()}\n\n`;
        }
        return retString;
    }
}