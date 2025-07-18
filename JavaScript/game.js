import {createCard, createCardDB } from "./cardCreation.js";
import {Deck} from "./deck.js";

// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { child, get, getDatabase, onValue, ref, update, runTransaction } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAAJkTBJ-CY7QOWlOHZ3_8glgOfAKRopg",
    authDomain: "duck-deckers.firebaseapp.com",
    databaseURL: "https://duck-deckers-default-rtdb.firebaseio.com",
    projectId: "duck-deckers",
    storageBucket: "duck-deckers.appspot.com",
    messagingSenderId: "499331695357",
    appId: "1:499331695357:web:5d45713977c74c6bb1b494",
    measurementId: "G-FG9BK67MLF"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

let userID = null;
let roomCreatorID = null;
let currentRoomCode = null;

let deck = new Deck([]);
let selectedCard = null;
let attackingCard = null;
let selectedZoneHand = null;
let selectedZonePlayer = null;
let selectedZoneEnemy = null;
let repeatPrevent = true;
let first = true;
//slot zones
let handSlot =
    [
        document.getElementById('handSlot0'),
        document.getElementById('handSlot1'),
        document.getElementById('handSlot2'),
        document.getElementById('handSlot3'),
        document.getElementById('handSlot4'),
        document.getElementById('handSlot5'),
        document.getElementById('handSlot6')
    ];

let enemySlot =
    [
        document.getElementById('dropZone0'),
        document.getElementById('dropZone1'),
        document.getElementById('dropZone2'),
        document.getElementById('dropZone3'),
        document.getElementById('dropZone4')
    ];

let playerSlot =
    [
        document.getElementById('dropZone5'),
        document.getElementById('dropZone6'),
        document.getElementById('dropZone7'),
        document.getElementById('dropZone8'),
        document.getElementById('dropZone9')
    ];
let enemyPlayer = document.getElementById('badGuyImg')


//image zones
let dropSlotImg =
    [
        document.getElementById('dropZone0img'),
        document.getElementById('dropZone1img'),
        document.getElementById('dropZone2img'),
        document.getElementById('dropZone3img'),
        document.getElementById('dropZone4img'),
        document.getElementById('dropZone5img'),
        document.getElementById('dropZone6img'),
        document.getElementById('dropZone7img'),
        document.getElementById('dropZone8img'),
        document.getElementById('dropZone9img')
    ];
let enemySlotImg =
    [
        document.getElementById('dropZone0img'),
        document.getElementById('dropZone1img'),
        document.getElementById('dropZone2img'),
        document.getElementById('dropZone3img'),
        document.getElementById('dropZone4img')
    ];
let playerSlotImg =
    [
        document.getElementById('dropZone5img'),
        document.getElementById('dropZone6img'),
        document.getElementById('dropZone7img'),
        document.getElementById('dropZone8img'),
        document.getElementById('dropZone9img')
    ];
let handSlotImg =
    [
        document.getElementById('handSlot0img'),
        document.getElementById('handSlot1img'),
        document.getElementById('handSlot2img'),
        document.getElementById('handSlot3img'),
        document.getElementById('handSlot4img'),
        document.getElementById('handSlot5img'),
        document.getElementById('handSlot6img')
    ];
let spellZoneImg = document.getElementById('spellZoneImg');

for(let i = 0; i < playerSlot.length; i++){
    playerSlot[i].addEventListener('click', async () => {
        switch (checkForOpponent()) {
            case 0:
                if (await checkTurn().then((r) => {return r;})) {
                    if (selectedZoneHand != null) {
                        try {
                            await playCard(i);
                        } catch (e) {
                            console.error(e);
                            alert(e.message);
                        }
                    } else {
                        selectCardPlayer(i);
                    }
                } else {
                    console.error("not your turn");
                    alert("Not your turn");
                }
                break;
            case 1:
                console.error("Opponent has forfeit");
                alert("Opponent has forfeit");
                break;
            case 2:
                console.error("Opponent has not yet joined");
                alert("Opponent has not joined yet");
                break;
        }
    });
}
for(let i = 0; i < enemySlot.length; i++){
    enemySlot[i].addEventListener('click', async () => {
        switch (checkForOpponent()) {
            case 0:
                if (await checkTurn().then((r) => {return r;})) {
                    if (attackingCard != null) {
                        attackCard(i + 5);
                    }
                } else {
                    console.error("not your turn");
                    alert("It is not your turn");
                }
                break;
            case 1:
                console.error("Opponent has forfeit");
                alert("Opponent has forfeit");
                break;
            case 2:
                console.error("Opponent has not joined yet");
                alert("Opponent has not joined yet");
                break;
        }
    });
}
for(let i = 0; i < handSlot.length; i++){
    handSlot[i].addEventListener('click', () => {
        switch(checkForOpponent()){
            case 0:
                selectCardHand(i);
                break;
            case 1:
                console.error("Opponent has forfeit");
                alert("Opponent has forfeit");
                break;
            case 2:
                console.error("Opponent has not joined yet");
                alert("Opponent has not joined yet");
                break;
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if(user) {
        userID = user.uid;
        get(ref(db, `users/${userID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                currentRoomCode = snapshot.val().currentRoom;
            } else {
                console.error("error getting current room code");
            }
        }).then(() => {
            console.log(currentRoomCode);
            get(ref(db, `rooms/${currentRoomCode}`)).then((snapshot) => {
                if(snapshot.exists()){
                    roomCreatorID = snapshot.val().roomCreator;
                } else {
                    console.error("error getting creator of room");
                }
            }).then(async () => {
                const buttons = document.getElementsByTagName("button");
                if (await getRound().then((result) =>{return result;}) == 1 && await fetchDeck(0).then((result) => {return result.cards.length;}) == 40) {
                    for (let i = 0; i < 3; i++) {
                        try {
                            await draw(true, 0);
                        } catch (e) {
                            alert(e.message);
                            console.error(e);
                        }
                    }
                }
                onValue(ref(db, `rooms/${currentRoomCode}`), async (data) => { //live data
                    switch (checkForMajorEvent()) {
                        case 0:
                            checkForCard();
                            checkCardStatus();
                            document.getElementById("playerHealth").innerHTML = getYourHealth(0);
                            document.getElementById("enemyHealth").innerHTML = getYourHealth(1);
                            document.getElementById("playerEmeralds").innerHTML = await getYourEmeralds().then((result) =>{return result;});
                            document.getElementById("currentTurn").innerHTML = `${getPlayerName(data.val().turn)}'s Turn`;
                            if (data.val().turn == userID) {
                                document.getElementById("passButton").disabled = false;
                            }
                            break;
                        case 1:
                            if (repeatPrevent) {
                                alert("You lose!");
                                for (const button of buttons) {
                                    button.disabled = true;
                                }
                                document.getElementById("quitButton").disabled = false; //re-enable quit button
                                repeatPrevent = false;
                            }
                            break;
                        case 2:
                            if (repeatPrevent) {
                                alert("You win!");
                                for (const button of buttons) {
                                    button.disabled = true;
                                }
                                document.getElementById("quitButton").disabled = false; //re-enable quit button
                                repeatPrevent = false;
                            }
                            break;
                        case 3:
                            if (repeatPrevent) {
                                alert("Opponent has forfeit");
                                for (const button of buttons) {
                                    button.disabled = true;
                                }
                                document.getElementById("quitButton").disabled = false; //re-enable quit button
                                repeatPrevent = false;
                            }
                            break;
                    }
                });
            });
        });
    } else {
        throw new Error("error getting user data");
    }
});

function checkForMajorEvent() {
    /*
    0: normal game
    1: you died
    2: opponent died
    3: opponent forfeit
    */
    const dbrefyou = refPlayer('', 0);
    const dbrefopponent = refPlayer('', 1);
    let result = 0;
    onValue(dbrefyou, (data) => {
        if(data.val().health <= 0){
            result = 1;
        }
    }, {
        onlyOnce: true
    });
    onValue(dbrefopponent, (data) => {
        if(data.exists()) {
            if (data.val().health <= 0) {
                result = 2;
            } else if (userID == roomCreatorID) {
                if (checkForOpponent() == 1) {
                    result = 3;
                }
            }
        } else if (userID != roomCreatorID && userID != null){
            result = 3;
        }
    }, {
        onlyOnce: true
    });
    return result;
}

function checkCardStatus() {
    const dbrefboard = ref(db, `rooms/${currentRoomCode}/boardPositions`);
    onValue(dbrefboard, (data) => {
        data.forEach((element) => {
            let offset = 0;
            if(userID == roomCreatorID && parseInt(element.key) > 4){
                offset = -5;
            } else if(userID == roomCreatorID){
                offset = 5;
            }
            if(element.val().card.type == 0){
                if(element.val().card.health <= 0){
                    dropSlotImg[parseInt(element.key)+offset].style.border = '7px solid green';
                    setTimeout(() => {
                        update(child(dbrefboard, `/${element.key}`), {
                            card: null
                        });
                        dropSlotImg[parseInt(element.key)+offset].style.border = '0px';
                        dropSlotImg[parseInt(element.key)+offset].style.opacity = '1';
                    }, 1000); //I changed it to 1 second, 2.5 seemed too clunky.
                } else if (element.val().card.stamina != 0){
                    dropSlotImg[parseInt(element.key) + offset].style.opacity = '0.8';
                    if(element.val().card.stamina == 2){
                        dropSlotImg[parseInt(element.key) + offset].style.border = `7px solid yellow`;
                    }
                } else if (element.val().card.stamina == 0){
                    dropSlotImg[parseInt(element.key) + offset].style.opacity = '1';
                    dropSlotImg[parseInt(element.key) + offset].style.border = '0px';
                }
            }
        });
    }, {
        onlyOnce: true
    });
}

function checkForCard(){
    const dbrefboard = ref(db, `rooms/${currentRoomCode}/boardPositions`);
    if (userID == roomCreatorID) {
        onValue(dbrefboard, (data) => {
            for(let i = 0; i < 5; i++){
                playerSlotImg[i].src = `../webpageImageAssets/dropZone.png`;
                enemySlotImg[i].src = `../webpageImageAssets/dropZone.png`;
            }
            data.forEach((element) => {
                if(element.val() != null){
                    let card = element.val().card;
                    if(element.key < 5) {
                        playerSlotImg[element.key].src = `../webpageImageAssets/${card.id}.png`;
                    } else {
                        enemySlotImg[element.key-5].src = `../webpageImageAssets/${card.id}.png`;
                    }
                }
            })
        }, {
            onlyOnce: true
        });
    } else {
        onValue(dbrefboard, (data) => {
            for(let i = 0; i < 5; i++){
                playerSlotImg[i].src = `../webpageImageAssets/dropZone.png`;
                enemySlotImg[i].src = `../webpageImageAssets/dropZone.png`;
            }
            data.forEach((element) => {
                if(element.val() != null){
                    let card = element.val().card;
                    if(element.key > 4) {
                        playerSlotImg[element.key-5].src = `../webpageImageAssets/${card.id}.png`;
                    } else {
                        enemySlotImg[element.key].src = `../webpageImageAssets/${card.id}.png`;
                    }
                }
            })
        }, {
            onlyOnce: true
        });
    }

    //hand slots
    const dbrefhand = refPlayer(`/hand`, 0);
    onValue(dbrefhand, (data) => {
        for(let i = 0; i < 7; i++){
            handSlotImg[i].src = `../webpageImageAssets/handSlot.png`;
        }
        data.forEach((element) => {
            if(element.val() != null){
                let card = element.val().card;
                handSlotImg[element.key].src = `../webpageImageAssets/${card.id}.png`;
            }
        })
    }, {
        onlyOnce: true
    });
}

async function playCard(zone){
    let updates = {};
    let emeralds = await getYourEmeralds().then((result) => {return result;});
    if(selectedCard.cost > emeralds){
        throw new Error("You do not have enough emeralds to play this card");
    }
    if(userID == roomCreatorID){ //if player 1
        if(fetchCard(zone) == null){
            handSlotImg[selectedZoneHand].style.border = '0px';
            updates[`rooms/${currentRoomCode}/boardPositions/${zone}/card`] = selectedCard;
            updates[`rooms/${currentRoomCode}/currentPlayers/player1/hand/${selectedZoneHand}`] = null;
            updates[`rooms/${currentRoomCode}/currentPlayers/player1/emeralds`] = emeralds - selectedCard.cost;
            //if(selectedCard.id ==3){ //SOUP
                //updates[`rooms/${currentRoomCode}/currentPlayers/player1/health`] +=4;
               // if(  updates[`rooms/${currentRoomCode}/currentPlayers/player1/health`]>20){
                    //updates[`rooms/${currentRoomCode}/currentPlayers/player1/health`] = 20;
              //  }
               // selectedCard.health = 0;
           // }
            update(ref(db), updates);
            selectedCard = null;
            selectedZoneHand = null;
        } else {
            throw new Error("There is already a card here");
        }
    } else {
        if(fetchCard(zone + 5) == null){
            handSlotImg[selectedZoneHand].style.border = '0px';
            updates[`rooms/${currentRoomCode}/boardPositions/${zone+5}/card`] = selectedCard;
            updates[`rooms/${currentRoomCode}/currentPlayers/player2/hand/${selectedZoneHand}`] = null;
            updates[`rooms/${currentRoomCode}/currentPlayers/player2/emeralds`] = emeralds - selectedCard.cost;
            if(selectedCard.id ==41){//CONSOLATION PRIZE
                updates[`rooms/${currentRoomCode}/currentPlayers/player2/emeralds`] = emeralds +=1;
                selectedCard.health = 0;
            }
            //if(selectedCard.id ==3){ //SOUP
               // updates[`rooms/${currentRoomCode}/currentPlayers/player2/health`] = health + 4;
                //if(updates[`rooms/${currentRoomCode}/currentPlayers/player2/health`]>20){
               //     updates[`rooms/${currentRoomCode}/currentPlayers/player2/health`] = 20;
              //  }
              //  selectedCard.health = 0;
          //  }
            update(ref(db), updates);
            selectedCard = null;
            selectedZoneHand = null;
        } else {
            throw new Error("There is already a card here");
        }
    }
}

async function checkForAvailableHandSlot(plr){//returns id of available hand slot, null if none
    let dbref = refPlayer(`hand`, plr);
    let availableSlot = null;
    for(let i = 0; i < 7; i++) {
        const data = await get(child(dbref, `/${i}`));
        if (data.val() == null) {
            availableSlot = i;
        }
        if(availableSlot != null) break;
    }
    return availableSlot;
}

async function fetchDeck(plr) { //fetches deck from firebase library
    const dbref = refPlayer(`/cards`, plr);
    let deck = new Deck([]);
    const data = await get(dbref);
    if(data.val() != null){
        for(let i = 0; i < data.val().cards.length; i++){
            let id;
            id = data.val().cards[i].id;
            deck.addCardBack(createCard(id));
        }
    } else {
        deck = null;
    }
    return deck;
}

function fetchCard(zone){
    const dbref = ref(db, `rooms/${currentRoomCode}/boardPositions/${zone}`);
    let card = null;
    onValue(dbref, (data) => {
        if(data.val() != null){
            card = createCardDB(data.val().card);
        }
    }, {
        onlyOnce: true
    });
    return card;
}

function returnDeck() {
    const dbref = refPlayer(``, 0);
    update(dbref, {
        cards: deck
    });
}

async function getRound(){
    const data = await get(ref(db, `rooms/${currentRoomCode}`));
    return data.val().round;
}

function getYourHealth(read){
    if(read == 0){
        const dbref = refPlayer(``, 0);
        let health = null;
        onValue(dbref, (data) => {
            if(data.val() != null){
                health = data.val().health;
            }
        }, {
            onlyOnce: true
        });
        return health;
    }else{
        const dbref = refPlayer('', 1);
        let health = null;
        onValue(dbref, (data) => {
            if(data.val() != null){
                health = data.val().health;
            }
        }, {
            onlyOnce: true
        });
        return health;
    }
}

async function getYourEmeralds() {
    const dbref = refPlayer(``, 0);
    const data = await get(dbref);
    return data.val().emeralds;
}

async function draw(override, plr){
    switch(checkForOpponent(override)) {
        case 0:
            if(await checkTurn().then((r) => {return r;}) || override) {
                const dbref = refPlayer(`/hand`, plr);
                let drawnCard;
                let availableSlot = await checkForAvailableHandSlot(plr);
                deck = await fetchDeck(plr);
                if (deck && availableSlot != null) {
                    drawnCard = deck.draw();
                    returnDeck();
                    update(child(dbref, `/${availableSlot}`), {
                        card: drawnCard
                    });
                } else {
                    if (deck == null) {
                        throw new Error("out of cards");
                    } else {
                        throw new Error("hand is full");
                    }
                }
            } else {
                throw new Error("Not your turn");
            }
            break;
        case 1:
            throw new Error("Opponent has forfeit");
        case 2:
            throw new Error("Opponent has not yet joined");
    }
}

function refPlayer(dataPath, plr){ //fetches a datapath based off player 1 or 2
    if(plr == 0) {
        if (userID == roomCreatorID && userID != null)
            return ref(db, `rooms/${currentRoomCode}/currentPlayers/player1/${dataPath}`);
        else if (userID != null)
            return ref(db, `rooms/${currentRoomCode}/currentPlayers/player2/${dataPath}`);
        else {
            throw new Error("error getting userID");
        }
    } else if(plr == 1){
        if (userID == roomCreatorID && userID != null)
            return ref(db, `rooms/${currentRoomCode}/currentPlayers/player2/${dataPath}`);
        else if (userID != null)
            return ref(db, `rooms/${currentRoomCode}/currentPlayers/player1/${dataPath}`);
        else {
            throw new Error("error getting userID");
        }
    } else {
        throw new Error("Invalid plr input");
    }
}

function selectCardHand(zone){
    const dbref = refPlayer(`/hand`,0);
    if(selectedCard == null){
        onValue(dbref, (data) => {
            if(data.val() != null) {
                if (data.val()[zone] != null) {
                    selectedCard = createCardDB(data.val()[zone].card);
                    selectedZoneHand = zone;
                    handSlotImg[zone].style.border = '7px solid blue';
                } else {
                    console.error("no card in selected spot");
                }
            }else{
                console.error("hand reference hasn't been initialized yet");
            }
        }, {
            onlyOnce: true
        })
    } else if(zone == selectedZoneHand) {
        selectedCard = null;
        selectedZoneHand = null;
        handSlotImg[zone].style.border = '0px';
    } else {
        console.error("a card is already selected");
    }
}

function selectCardPlayer(zone){
    let offset = 0;
    if(userID != roomCreatorID){offset = 5;}
    if(selectedCard == null && attackingCard == null){
        if(fetchCard(zone + offset) != null) {
            selectedCard = fetchCard(zone + offset);
            selectedZonePlayer = zone;
            playerSlotImg[zone].style.border = '7px solid blue';
        } else {
            console.error("no card in selected spot");
        }
    } else if(zone == selectedZonePlayer && attackingCard == null) {
        if(selectedCard.stamina == 2){
            playerSlotImg[zone].style.border = '7px solid yellow';
        } else {
            playerSlotImg[zone].style.border = '0px';
        }
        selectedCard = null;
        selectedZonePlayer = null;
    } else {
        console.error("a card is already selected");
    }
}

function attackCard(zone) { //should only ever be used in attacking mode
    let offset = 0;
    if(userID != roomCreatorID){offset = -5;}
    if(selectedZoneHand == null){
        if(fetchCard(zone + offset) != null && fetchCard(zone + offset).type == 0) {
            let updates = {};
            selectedCard = fetchCard(zone + offset);
            selectedZoneEnemy = zone;
            attackingCard.attack(selectedCard);
            updates[`rooms/${currentRoomCode}/boardPositions/${zone + offset}/card`] = selectedCard;
            updates[`rooms/${currentRoomCode}/boardPositions/${selectedZonePlayer - offset}/card`] = attackingCard;
            update(ref(db), updates);
            playerSlotImg[selectedZonePlayer].style.border = '0px';
            selectedCard = null;
            attackingCard = null;
            selectedZoneEnemy = null;
            selectedZonePlayer = null;
        } else if(fetchCard(zone + offset) != null && fetchCard(zone + offset).type != 0) {
            console.error("cannot attack spell/land");
        } else {
            console.error("no card in selected space");
        }
    } else {
        console.error("cannot use hand cards on enemy cards (for now)");
    }
}

function initiateAttack(){
    if(selectedZonePlayer != null) {
        if(selectedCard.stamina == 0) {
            if (selectedCard.type == 0 || attackingCard != null) {
                if (attackingCard == null) {
                    playerSlotImg[selectedZonePlayer].style.border = '7px solid red';
                    attackingCard = selectedCard;
                    selectedCard = 0;
                } else {
                    selectedCard = attackingCard;
                    attackingCard = null;
                    playerSlotImg[selectedZonePlayer].style.border = '7px solid blue';
                }
            } else {
                throw new Error("Cannot attack with a spell/land");
            }
        } else if(attackingCard != null){
            attackingCard = null;
            playerSlotImg[selectedZonePlayer].style.border = '7px solid blue';
        } else {
            throw new Error("This duck is tired! Please wait until your next turn before using them to attack");
        }
    } else {
        throw new Error("No duck is selected");
    }
}

function getPlayerName(id){
    let name = null;
    if(id == roomCreatorID && id != null){
        onValue(ref(db, `rooms/${currentRoomCode}/currentPlayers/player1`), (data) => {
            name = data.val().name;
        }, {
            onlyOnce: true
        });
    } else if(id != null){
        onValue(ref(db, `rooms/${currentRoomCode}/currentPlayers/player2`), (data) => {
            name = data.val().name;
        }, {
            onlyOnce: true
        });
    } else {
        throw new Error("error getting display name");
    }
    return name;
}

async function checkTurn() {
    let data = await get(ref(db, `rooms/${currentRoomCode}`));
    return data.val().turn == userID;
}

async function passTurn(){

    switch(checkForOpponent()) {
        case 0:
            if(await checkTurn().then((r) => {return r;})) {
                if (selectedCard == null) {
                    let updates = {};
                    let add = 0;
                    let round = await getRound().then((r) => {return r;});
                    const boardData = await get(ref(db, `rooms/${currentRoomCode}/boardPositions`));
                    const opponentData = await get(refPlayer('', 1));

                    try{
                        await draw(false, 1);
                    } catch (e){
                        console.error(e);
                    }
                    updates[`rooms/${currentRoomCode}/turn`] = opponentData.val().uid;
                    boardData.forEach((element) => {
                        if(roomCreatorID == userID){
                            if(parseInt(element.key) > 4 && element.val().card.type == 0){
                                updates[`rooms/${currentRoomCode}/boardPositions/${parseInt(element.key)}/card/stamina`] = 0;
                            }
                        } else {
                            if(parseInt(element.key) < 5 && element.val().card.type == 0){
                                updates[`rooms/${currentRoomCode}/boardPositions/${parseInt(element.key)}/card/stamina`] = 0;
                            }
                        }
                    });
                    if(userID != roomCreatorID){
                        updates[`rooms/${currentRoomCode}/round`] = round + 1;
                        if(round <= 9){add = 1;}
                    }
                    if(round <= 10){
                        updates[refPlayer('emeralds', 1).toJSON().replace("https://duck-deckers-default-rtdb.firebaseio.com/", "")] = round + add;
                    } else {
                        updates[refPlayer('emeralds', 1).toJSON().replace("https://duck-deckers-default-rtdb.firebaseio.com/", "")] = 10;
                    }
                    await update(ref(db), updates);
                    document.getElementById("passButton").disabled = true;
                } else {
                    throw new Error("Please de-select all cards before passing your turn");
                }
            } else {
                throw new Error("Not your turn");
            }
            break;
        case 1:
            console.log("Opponent has forfeit, majorEvent function should run");
            break;
        case 2:
            throw new Error("Opponent has not joined yet");
    }
}

function checkForOpponent(override){
    let result = null;
    if(override){return 0;}//override checks
    const opponentRef = refPlayer('', 1);
    onValue(opponentRef, (data) => {
        if(data.val().uid != null && data.val().uid != "quit"){
            result = 0;
        } else if (data.val().uid != null){
            result = 1;
        } else {
            result = 2;
        }
    }, {
        onlyOnce: true
    });
    return result;
}

document.addEventListener('keydown', async function (event) {
    if (event.key === ` `) {
        try {
            initiateAttack();
        }catch (e) {
            console.error(e);
            alert(e.message);
        }
    }
});

document.getElementById("passButton").addEventListener("click", async () => {
    try{
        await passTurn();
    } catch(e){
        console.error(e);
        alert(e.message);
    }
});

document.getElementById("badGuy").addEventListener("click", () => {
    let check = true;
    if(userID == roomCreatorID){
        for(let i = 0; i < 5; i++){
            if(fetchCard(i + 5) != null){check = false;}
        }
    } else {
        for(let i = 0; i < 5; i++){
            if(fetchCard(i) != null){check = false;}
        }
    }
    if(check){ //if the attacking card is not null
        if(attackingCard != null){
            let offset = 0;
            if(userID != roomCreatorID){ //if player 2
                offset = 5;
            }
            let opponentRef = refPlayer(`/health`, 1);
            update(ref(db, `rooms/${currentRoomCode}/boardPositions/${selectedZonePlayer + offset}/card`), {
                stamina: 1
            });
            runTransaction(opponentRef, (health) => {
                return health -= attackingCard.damage;
            });
            playerSlotImg[selectedZonePlayer].style.border = '0px';
            attackingCard = null;
            selectedCard = null;
        }
    } else {
        console.error("All enemy ducks must be eliminated before attacking opponent health");
        alert("All enemy ducks must be eliminated before attacking opponent health");
    }
});