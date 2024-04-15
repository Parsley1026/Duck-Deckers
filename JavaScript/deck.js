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

    shuffle(){
        for(let i = 0; i < 5; i++) {
            this.cards.sort(() => Math.random() - 0.5);
        }
    }

    populate(){
        this.cards = [];
        for(let i = 0; i < 40; i++){
            this.cards.push(createCard(i));
        }
    }

    addCard(card){ //adds card to top of deck (for "Junk Mail" card, ID: 40)
        this.cards.unshift(card);
    }

    draw(){
        if(this.cards.length !== 0) {
            let card;
            card = this.cards.shift();
            return card;
        } else {
            return "no more cards";
        }
    }
}