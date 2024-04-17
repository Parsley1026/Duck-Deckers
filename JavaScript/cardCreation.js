import {Duck, Spell, Land} from "./card.js";
import data from "../cardMaster.json" with { type : 'json'};

export function createCard(id) { //create a card from cardMaster.json based on input id #
    let card;
        const keys = Object.keys(data); //get id of cards via json directories
        switch(data[keys[id]].type){ //create card depending on card type
            case 0: //card type 0 is a duck, so create duck
                card = new Duck(
                    keys[id],
                    data[keys[id]].name,
                    data[keys[id]].cost,
                    data[keys[id]].type,
                    data[keys[id]].effect,
                    data[keys[id]].damage,
                    data[keys[id]].health
                );
                break;
            case 1: //card type 1 is a spell, so create spell
                card = new Spell(
                    keys[id],
                    data[keys[id]].name,
                    data[keys[id]].cost,
                    data[keys[id]].type,
                    data[keys[id]].effect,
                );
                break;
            case 2: //card type 2 is a land, so create land
                card = new Land(
                    keys[id],
                    data[keys[id]].name,
                    data[keys[id]].cost,
                    data[keys[id]].type,
                    data[keys[id]].effect,
                );
                break;
        }
    return card;
}

export function createCardDB(data){
    let card;
    switch(data.type) {
        case 0:
            let effect = null;
            if(data.effect != null){effect = data.effect;}
            card = new Duck(
                data.id,
                data.name,
                data.cost,
                data.type,
                effect,
                data.damage,
                data.health
            );
            break;
        case 1:
            card = new Spell(
                data.id,
                data.name,
                data.cost,
                data.type,
                data.effect,
            );
            break;
        case 2:
            card = new Land(
                data.id,
                data.name,
                data.cost,
                data.type,
                data.effect,
            );
            break;
    }
    return card;
}

