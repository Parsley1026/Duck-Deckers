import { createCard } from "./cardCreation.js";
import { Duck, Spell, Land } from "./card.js";
import { Deck } from "./deck.js";
import {currentRoomCode} from "./roomFB.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, get, ref, onValue, update, remove, onChildAdded } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
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

//card zone
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

let handSlot1 = document.getElementById('handSlot0');
let handSlot2 = document.getElementById('handSlot1');
let handSlot3 = document.getElementById('handSlot2');
let handSlot4 = document.getElementById('handSlot3');
let handSlot5 = document.getElementById('handSlot4');
let handSlot6 = document.getElementById('handSlot5');
let handSlot7 = document.getElementById('handSlot6');

//image zones
let enemySlot1img = document.getElementById('dropZone0img');
let enemySlot2img = document.getElementById('dropZone1img');
let enemySlot3img = document.getElementById('dropZone2img');
let enemySlot4img = document.getElementById('dropZone3img');
let enemySlot5img = document.getElementById('dropZone4img');

let playerSlot1img = document.getElementById('dropZone5img');
let playerSlot2img = document.getElementById('dropZone6img');
let playerSlot3img = document.getElementById('dropZone7img');
let playerSlot4img = document.getElementById('dropZone8img');
let playerSlot5ing = document.getElementById('dropZone9img');

let handSlot1img = document.getElementById('handSlot0img');
let handSlot2img = document.getElementById('handSlot1img');
let handSlot3img = document.getElementById('handSlot2img');
let handSlot4img = document.getElementById('handSlot3img');
let handSlot5img = document.getElementById('handSlot4img');
let handSlot6img = document.getElementById('handSlot5img');
let handSlot7img = document.getElementById('handSlot6img');




//create our game function to run game
let game = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userID = user.uid;
                onChildAdded(ref(db, `rooms/${currentRoomCode}/boardPositions/a1`), (data) => {
                    console.log("hit");
                    if(data.val() != null){
                        let card = data.val().card;
                        enemySlot1img.src = `../webpageImageAssets/${0}.png`;
                    } else {
                        enemySlot1img.src = `../webpageImageAssets/dropZone.png`;
                    }
                })
        } else {
            console.log("error getting user data");
        }
    });
}

function playCard(zone){
    switch(zone) {
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
            update(ref(db, 'rooms/' + currentRoomCode + '/boardPositions/a1'), {
                card: createCard(0)
            });
            break;
    }
}


//run game
window.addEventListener('load', game);

//all the buttons
enemySlot1.addEventListener('click', () => playCard(0));
enemySlot2.addEventListener('click', () => playCard(1));
enemySlot3.addEventListener('click', () => playCard(2));
enemySlot4.addEventListener('click', () => playCard(3));
enemySlot5.addEventListener('click', () => playCard(4));


