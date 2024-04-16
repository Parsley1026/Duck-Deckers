import {createCard} from "./cardCreation.js";
import {Deck} from "./deck.js";

// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { child, get, getDatabase, onValue, ref, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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
let selectedZone = null;

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
    playerSlot[i].addEventListener('click', () => {playCard(i);});
}
for(let i = 0; i < handSlot.length; i++){
    handSlot[i].addEventListener('click', () => {selectCardHand(i);});
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
                onValue(ref(db, `rooms/${currentRoomCode}`), () => {
                    checkForCard();
                });
            })
        })
    } else {
        throw new Error("error getting user data");
    }
});

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
    const dbrefhand = refPlayer(`/hand`);
    onValue(dbrefhand, (data) => {
        for(let i = 0; i < 6; i++){
            handSlotImg[i].src = `../webpageImageAssets/handSlot.png`;
        }
        data.forEach((element) => {
            if(element.val() != null){
                let card = element.val();
                handSlotImg[element.key].src = `../webpageImageAssets/${card.id}.png`;
            }
        })
    }, {
        onlyOnce: true
    });
}


function playCard(zone){
    const dbrefhand = refPlayer(`/hand`);
    const dbrefboard = ref(db, `rooms/${currentRoomCode}/boardPositions`);
}

function checkForAvailableHandSlot(){//returns id of available hand slot, null if none
    let dbref = refPlayer(`hand`);
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
    const dbref = refPlayer(`/cards`);
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

function returnDeck() {
    const dbref = refPlayer(``);
    update(dbref, {
       cards: deck
    });
}

function draw(){
    const dbref = refPlayer(`/hand`);
    let drawnCard;
    let availableSlot = checkForAvailableHandSlot();
    deck = fetchDeck();
    if(deck && availableSlot != null){
        drawnCard = deck.draw();
        returnDeck();
        update(child(dbref, `/${availableSlot}`), {
            card: drawnCard
        });
    } else {
        if(deck == null){
            console.error("out of cards");
        } else {
            console.error("hand is full");
        }
    }
}

function refPlayer(dataPath){ //fetches a datapath based off player 1 or 2
    if(userID == roomCreatorID && userID != null)
        return ref(db, `rooms/${currentRoomCode}/currentPlayers/player1/${dataPath}`);
    else if(userID != null)
        return ref(db, `rooms/${currentRoomCode}/currentPlayers/player2/${dataPath}`);
    else {
        throw new Error("error getting userID");
    }
}

function selectCardHand(zone){
    const dbref = refPlayer(`/hand`);
    if(selectedCard == null){
        onValue(dbref, (data) => {
            if(data.val() != null) {
                if (data.val()[zone] != null) {
                    selectedCard = data.val()[zone].card;
                    selectedZone = zone;
                    handSlotImg[zone].style.border = '7px solid red';
                } else {
                    console.error("no card in selected spot");
                }
            }else{
                console.error("hand reference hasn't been initialized yet");
            }
        })
    } else if(zone == selectedZone) {
        selectedCard = null;
        handSlotImg[zone].style.border = '0px';
    } else {
        console.error("a card is already selected");
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === '1') {
        draw();
    }
});
