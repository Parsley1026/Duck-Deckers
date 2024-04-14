

let card = document.getElementById("dragTest");
let dropZone1 = document.getElementById("dropZone");
let dropZone2 = document.getElementById("dropZone2");
let selected = false;
let lockedIn = false;

let select = () => { //when the card is clicked. this needs to be scaled so multiple cards can use this function
    if(!selected){ //if it ISN'T selected
        card.style.border = '7px solid red' //put a red indicator around the card
        selected = true; //the card is now selected
        if(lockedIn){ //if the card is already in a tile
            alert("Who do you want to attack") //this is where you can choose to attack cards
        }
    }else { //if it IS selected
        card.style.border = '0px solid red' //take away the indicator
        selected = false; //it is now not selected
    }
}
function move(zone) { //clicking on specific zones/tiles will pass in different parameters
    if (selected && !lockedIn) { //if the card is selected and not yet in a zone
        let dropZone;
        if (zone === 1) {
            dropZone = dropZone1; //designates the zone based on the passed parameter
        } else if (zone === 2) {
            dropZone = dropZone2;
        }
        if (dropZone) {
            card.style.left = dropZone.getBoundingClientRect().left + 'px'; //put the card in the zone
            card.style.top = dropZone.getBoundingClientRect().top + 'px';
            lockedIn = true; //it is now locked in
            selected = false; //deselect the card
            card.style.border = '0px solid red' //remove indicator
        }
    }
}




card.addEventListener('click', select); // when the card is clicked. again, this needs to be able to support multiple cards somehow

dropZone1.addEventListener('click', () => move(1));
dropZone2.addEventListener('click', () => move(2));