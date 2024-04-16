import {createCard} from "./cardCreation.js";
import {Deck} from "./deck.js";

// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { child, get, getDatabase, onValue, ref, update, onChildAdded } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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

let enemySlot1 = document.getElementById('dropZone0');
let enemySlot2 = document.getElementById('dropZone1');
let enemySlot3 = document.getElementById('dropZone2');
let enemySlot4 = document.getElementById('dropZone3');
let enemySlot5 = document.getElementById('dropZone4');

let playerSlot1 = document.getElementById('dropZone5');
let playerSlot2 = document.getElementById('dropZone6');
let playerSlot3 = document.getElementById('dropZone7');
let playerSlot4 = document.getElementById('dropZone8');
let playerSlot5 = document.getElementById('dropZone9');

//image zones
let enemySlot1img = document.getElementById('dropZone0img');
let enemySlot2img = document.getElementById('dropZone1img');
let enemySlot3img = document.getElementById('dropZone2img');
let enemySlot4img = document.getElementById('dropZone3img');
let enemySlot5img = document.getElementById('dropZone4img');

let enemySlotImg =
    [
        document.getElementById('dropZone0img'),
        document.getElementById('dropZone1img'),
        document.getElementById('dropZone2img'),
        document.getElementById('dropZone3img'),
        document.getElementById('dropZone4img')
    ];

let playerSlot1img = document.getElementById('dropZone5img');
let playerSlot2img = document.getElementById('dropZone6img');
let playerSlot3img = document.getElementById('dropZone7img');
let playerSlot4img = document.getElementById('dropZone8img');
let playerSlot5img = document.getElementById('dropZone9img');

playerSlot1.addEventListener('click', () => playCard(0));
playerSlot2.addEventListener('click', () => playCard(1));
playerSlot3.addEventListener('click', () => playCard(2));
playerSlot4.addEventListener('click', () => playCard(3));
playerSlot5.addEventListener('click', () => playCard(4));


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

        onChildAdded(dbrefboard, (data) => {
            console.log(data.val());
            if(data.val() != null){
                let card = data.val().card;
                console.log(card.id);
                enemySlotImg[0].src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlotImg[0].src = `../webpageImageAssets/dropZone.png`;
            }
        }, {
            onlyOnce: true
        });

        //player spots
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a1'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot1img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot1img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a2'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot2img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot2img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a3'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot3img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot3img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a4'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot4img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot4img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a5'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot5img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot5img.src = '../webpageImageAssets/dropZone.png';
            }
        });

        //enemy spots
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b1'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot1img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot1img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b2'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot2img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot2img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b3'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot3img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot3img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b4'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot4img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot4img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b5'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot5img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot5img.src = '../webpageImageAssets/dropZone.png';
            }
        });
    } else {

        //player spots
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b1'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot1img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot1img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b2'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot2img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot2img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b3'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot3img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot3img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b4'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot4img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot4img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b5'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                playerSlot5img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                playerSlot5img.src = '../webpageImageAssets/dropZone.png';
            }
        });

        //enemy slots
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a1'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot1img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot1img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a2'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot2img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot2img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a3'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot3img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot3img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a4'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot4img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot4img.src = '../webpageImageAssets/dropZone.png';
            }
        });
        onValue(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a5'), (snapshot) => {
            if (snapshot.val() != null) {
                let card = snapshot.val().card;
                enemySlot5img.src = `../webpageImageAssets/${card.id}.png`;
            } else {
                enemySlot5img.src = '../webpageImageAssets/dropZone.png';
            }
        });
    }

    //hand slots
    const dbrefhand = refPlayer(`/hand`);
    onValue(dbrefhand, (data) => {
        if(data.val() != null) {
            for (let i = 0; i < 7; i++) {
                if (data.val()[i] != null) {
                    let card = data.val()[i];
                    handSlotImg[i].src = `../webpageImageAssets/${card.id}.png`;
                } else {
                    handSlotImg[i].src = '../webpageImageAssets/handSlot.png';
                }
            }
        } else {
            console.log("hand empty");
        }
    }, {
        onlyOnce: true
    });
}


function playCard(zone){
    if(userID == roomCreatorID) {
        switch (zone) {
            case 0:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a1'), {
                    card: createCard(0)
                });
                break;
            case 1:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a2'), {
                    card: createCard(0)
                });
                break;
            case 2:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a3'), {
                    card: createCard(0)
                });
                break;
            case 3:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a4'), {
                    card: createCard(0)
                });
                break;
            case 4:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a5'), {
                    card: createCard(0)
                });
                break;
        }
    } else {
        switch (zone) {
            case 0:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b1'), {
                    card: createCard(0)
                });
                break;
            case 1:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b2'), {
                    card: createCard(0)
                });
                break;
            case 2:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b3'), {
                    card: createCard(0)
                });
                break;
            case 3:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b4'), {
                    card: createCard(0)
                });
                break;
            case 4:
                update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/b5'), {
                    card: createCard(0)
                });
                break;
        }
    }
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
        update(dbref, {
            [availableSlot]: drawnCard
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

document.addEventListener('keydown', function(event) {
    if (event.key === 'd') {
        console.log(checkForAvailableHandSlot());
    }
    if (event.key === '1') {
        draw();
    }
});
