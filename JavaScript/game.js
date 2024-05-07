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

for(let i = 0; i < playerSlot.length; i++){
    playerSlot[i].addEventListener('click', () => {
        switch(checkForPlayer2()) {
            case 0:
                if (checkTurn()) {
                    if (selectedZoneHand != null) {
                        playCard(i);
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
    enemySlot[i].addEventListener('click', () => {
        switch(checkForPlayer2()){
            case 0:
                if (checkTurn()) {
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
        switch(checkForPlayer2()){
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
            }).then(() => {
                onValue(ref(db, `rooms/${currentRoomCode}`), (data) => { //live data
                    const buttons = document.getElementsByTagName("button");
                    switch(checkForMajorEvent()) {
                        case 0:
                            checkForCard();
                            checkCardStatus();
                            document.getElementById("playerHealth").innerHTML = getYourHealth(0);
                            document.getElementById("enemyHealth").innerHTML = getYourHealth(1);
                            document.getElementById("currentTurn").innerHTML = `${getPlayerName(data.val().turn)}'s Turn`;
                            break;
                        case 1:
                            alert("You lose!");
                            for (const button of buttons) {
                                button.disabled = true;
                            }
                            document.getElementById("quitButton").disabled = false; //re-enable quit button
                            break;
                        case 2:
                            alert("You win!");
                            for (const button of buttons) {
                                button.disabled = true;
                            }
                            document.getElementById("quitButton").disabled = false; //re-enable quit button
                            break;
                        case 3:
                            alert("Opponent has forfeit");
                            for (const button of buttons) {
                                button.disabled = true;
                            }
                            document.getElementById("quitButton").disabled = false; //re-enable quit button
                            break;
                    }
                });
            })
        })
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
                if (checkForPlayer2() == 1) {
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
            if(element.val().card.type == 0 && element.val().card.health <= 0){
                let offset = 0;
                if(userID == roomCreatorID && parseInt(element.key) > 4){
                    offset = -5;
                } else if(userID == roomCreatorID){
                    offset = 5;
                }
               dropSlotImg[parseInt(element.key)+offset].style.border = '7px solid green';
               setTimeout(() => {
                   update(child(dbrefboard, `/${element.key}`), {
                       card: null
                   });
                   dropSlotImg[parseInt(element.key)+offset].style.border = '0px';
               }, 2500); //2.5 second wait before card removal
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

function playCard(zone){
    let updates = {};
    if(userID == roomCreatorID){
        if(fetchCard(zone) == null){
            handSlotImg[selectedZoneHand].style.border = '0px';
            updates[`rooms/${currentRoomCode}/boardPositions/${zone}/card`] = selectedCard;
            updates[`rooms/${currentRoomCode}/currentPlayers/player1/hand/${selectedZoneHand}`] = null;
            update(ref(db), updates);
            selectedCard = null;
            selectedZoneHand = null;
        } else {
            console.error("there is already a card here");
        }
    } else {
        if(fetchCard(zone + 5) == null){
            handSlotImg[selectedZoneHand].style.border = '0px';
            updates[`rooms/${currentRoomCode}/boardPositions/${zone+5}/card`] = selectedCard;
            updates[`rooms/${currentRoomCode}/currentPlayers/player2/hand/${selectedZoneHand}`] = null;
            update(ref(db), updates);
            selectedCard = null;
            selectedZoneHand = null;
        } else {
            console.error("there is already a card here");
        }
    }
}

function checkForAvailableHandSlot(){//returns id of available hand slot, null if none
    let dbref = refPlayer(`hand`, 0);
    let availableSlot = null;
    for(let i = 0; i < 7; i++) {
        onValue(child(dbref, `/${i}`), (data) => {
            if (data.val() == null) {
                availableSlot = i;
            }
        }, {
            onlyOnce: true
        });
        if(availableSlot != null) break;
    }
    return availableSlot;
}

function fetchDeck() { //fetches deck from firebase library
    const dbref = refPlayer(`/cards`, 0);
    let deck = new Deck([]);
    onValue(dbref, (data) => {
        if(data.val() != null){
            for(let i = 0; i < data.val().cards.length; i++){
                let id;
                id = data.val().cards[i].id;
                deck.addCardBack(createCard(id));
            }
        } else {
            deck = null;
        }
    }, {
        onlyOnce: true
    });
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
        let player;
        if(userID == roomCreatorID){
            player = 2;
        }else{
            player = 1;
        }
        let health = null;
        onValue(ref(db,`rooms/${currentRoomCode}/currentPlayers/player${player}`), (data) => {
            if(data.val() != null){
                health = data.val().health;
            }
        }, {
            onlyOnce: true
        });
        return health;
    }

}

function draw(){
    switch(checkForPlayer2()) {
        case 0:
            const dbref = refPlayer(`/hand`, 0);
            let drawnCard;
            let availableSlot = checkForAvailableHandSlot();
            deck = fetchDeck();
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
        selectedCard = null;
        selectedZonePlayer = null;
        playerSlotImg[zone].style.border = '0px';
    } else {
        console.error("a card is already selected");
    }
}

function attackCard(zone) { //should only ever be used in attacking mode
    let offset = 0;
    if(userID != roomCreatorID){offset = -5;}
    if(selectedZoneHand == null){
        if(fetchCard(zone + offset) != null && fetchCard(zone + offset).type == 0) {
            selectedCard = fetchCard(zone + offset);
            selectedZoneEnemy = zone;
            attackingCard.attack(selectedCard);
            update(ref(db, `rooms/${currentRoomCode}/boardPositions/${zone + offset}`), {
                card: selectedCard
            });
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
        if(selectedCard.type == 0 || attackingCard != null) {
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
            console.log("cannot attack with a spell/land")
        }
    } else {
        console.error("no duck is selected");
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

function checkTurn() {
    let currentTurn = null;
    onValue(ref(db, `rooms/${currentRoomCode}/turn`), (data) => {
        currentTurn = data.val();
    }, {
        onlyOnce: true
    });
    return currentTurn == userID;
}

function passTurn(){
    if(selectedCard == null) {
        let opponentUid = null;
        if(userID == roomCreatorID){
            onValue(ref(db, `rooms/${currentRoomCode}/currentPlayers/player2`), (data) => {
                opponentUid = data.val().uid;
            }, {
                onlyOnce: true
            });
        } else {
            onValue(ref(db, `rooms/${currentRoomCode}/currentPlayers/player1`), (data) => {
                opponentUid = data.val().uid;
            }, {
                onlyOnce: true
            });
        }
        update(ref(db, `rooms/${currentRoomCode}`), {
            turn: opponentUid
        });
    } else {
        throw new Error("Please de-select all cards before passing your turn");
    }
}

function checkForPlayer2(){
    let result = null;
    onValue(ref(db, `rooms/${currentRoomCode}/currentPlayers/player2`), (data) => {
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

document.addEventListener('keydown', function(event) {
    if (event.key === '1') {
        try{
            draw();
        } catch (e) {
            console.error(e.message);
            alert(e.message);
        }
    }
    if (event.key === `a`) {
        initiateAttack();
    }
});

document.getElementById("passButton").addEventListener("click", () => {
    try{
        passTurn();
    } catch(e){
        console.error(e.message);
        alert(e.message);
    }
});

document.getElementById("badGuy").addEventListener("click", () => {
    let check = null;
    if(userID == roomCreatorID){
        for(let i = 0; i < 5; i++){
            if(fetchCard(i) != null){check = false;}
        }
    } else {
        for(let i = 0; i < 5; i++){
            if(fetchCard(i + 5) != null){check = false;}
        }
    }

    if(!check){
        if(attackingCard != null){
            let opponentRef = refPlayer(`/health`, 1);
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