import { Deck } from "./deck.js";
import {createCard} from "./cardCreation.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, set, ref, update, onValue, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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

//grab all the data from the form
let fNameInput = document.getElementById('firstName'); //links with my h2 tags above
let lNameInput = document.getElementById('lastName');
let SignOutButton = document.getElementById('signOutButton');
let createRoomInput = document.getElementById('codeCreateInput');
let joinRoomInput = document.getElementById('codeJoinInput');
let createRoomButton = document.getElementById('codeCreateButton');
let joinRoomButton = document.getElementById('codeJoinButton');
let cashInput = document.getElementById('cash');

//room creation method
function createRoom(){
    const roomCode = createRoomInput.value; //room code from user input
    const userID = auth.currentUser.uid; //current userID
    if (roomCode == "") {//check if anything is entered in room code, otherwise, return error to user
        alert("Please enter a room code"); //alert user
    } else {//room code was entered, execute code
        onValue(ref(db, `rooms/${roomCode}`), (data) => {
            if (data.val() == null) {
                let deck = new Deck([]);
                get(ref(db, `users/${userID}/cards`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        for(let i = 0; i < 10; i++) {
                            let id;
                            id = snapshot.val().cards[i].id;
                            deck.addCardBack(createCard(0)); //adds 10 ducks
                        }
                        for(let i = 0; i < 10; i++) {
                            let id;
                            id = snapshot.val().cards[i].id;
                            deck.addCardBack(createCard(6)); ///adds 10 duckrades
                        }
                        for(let i = 0; i < 10; i++) {
                            let id;
                            id = snapshot.val().cards[i].id;
                            deck.addCardBack(createCard(14)); //adds 10 duckskateers
                        }
                        for(let i = 0; i < 10; i++) {
                            let id;
                            id = snapshot.val().cards[i].id;
                            deck.addCardBack(createCard(15)); //adds 5 gym bros
                        }
                    } else {
                        console.log("error getting deck");
                    }
                    deck.shuffle();
                }).then(() => {
                    set(ref(db, 'rooms/' + roomCode), {
                        roomCreator: userID, //define creator of room
                        turn: userID,
                        round: 1,
                        currentPlayers: {
                            player1: {
                                uid: userID,
                                name: auth.currentUser.displayName,
                                health: 20,
                                emeralds: 1,
                                hand: {
                                    0: null,
                                    1: null,
                                    2: null,
                                    3: null,
                                    4: null,
                                    5: null,
                                    6: null
                                },
                                cards: deck
                            },
                            player2: {
                                uid: null,
                                name: null,
                                health: 20,
                                emeralds: 1,
                                hand: {
                                    0: null, //WIENER
                                    1: null,
                                    2: null,
                                    3: null,
                                    4: null,
                                    5: null,
                                    6: null
                                }
                            }
                        },
                        boardPositions: {
                            0: {
                                card: null
                            },
                            1: {
                                card: null
                            },
                            2: {
                                card: null
                            },
                            3: {
                                card: null
                            },
                            4: {
                                card: null
                            },
                            5: {
                                card: null
                            },
                            6: {
                                card: null
                            },
                            7: {
                                card: null
                            },
                            8: {
                                card: null
                            },
                            9: {
                                card: null
                            }
                        },
                        arrowPositions: {
                            base: null, //set to board positions
                            tip: null
                        }
                    })
                });
                update(ref(db, 'users/' + userID), {
                    currentRoom: roomCode //set active room in current user's database
                })
                    .then(() => {
                        setTimeout(() => {
                            window.location.href = 'room.html'
                        }, 250); //250ms wait to create room
                    })
                    .catch((e) => {
                        console.error(e.message);
                    })
            } else {
                console.error("Room already exists, please try a different code")
                alert("Room already exists, please try a different code");
            }
        }, {
            onlyOnce: true
        });
    }
}

//joinRoom method
let joinRoom = evt => {
    evt.preventDefault();
    const roomCode = joinRoomInput.value;
    const userID = auth.currentUser.uid;
    if(roomCode == ""){//check if room code was entered by user, otherwise, return error to user
        alert("Please enter a room code"); //notify user
    } else { //room code was entered, run function
        get(ref(db, 'rooms/' + roomCode)).then((snapshot) => { //check if room exists
            if(snapshot.exists()){
                if(snapshot.val().currentPlayers.player2.uid == null) {
                    update(ref(db, 'users/' + userID), {
                        currentRoom: roomCode //set active room in current user's database
                    })
                        .then(() => {
                            let deck = new Deck([]);
                            get(ref(db, `users/${userID}/cards`)).then((snapshot) => {
                                if(snapshot.exists()){
                                    for(let i = 0; i < 10; i++) {
                                        let id;
                                        id = snapshot.val().cards[i].id;
                                        deck.addCardBack(createCard(0)); //adds 10 ducks
                                    }
                                    for(let i = 0; i < 10; i++) {
                                        let id;
                                        id = snapshot.val().cards[i].id;
                                        deck.addCardBack(createCard(6)); ///adds 10 duckrades
                                    }
                                    for(let i = 0; i < 10; i++) {
                                        let id;
                                        id = snapshot.val().cards[i].id;
                                        deck.addCardBack(createCard(14)); //adds 10 duckskateers
                                    }
                                    for(let i = 0; i < 10; i++) {
                                        let id;
                                        id = snapshot.val().cards[i].id;
                                        deck.addCardBack(createCard(15)); //adds 5 gym bros
                                    }
                                } else {
                                    console.log("error getting deck");
                                }
                                deck.shuffle();
                                deck.removeBottom();
                                deck.addCardFront(createCard(41));
                            }).then(() => {
                                update(ref(db, 'rooms/' + roomCode + '/currentPlayers/player2'), {
                                    uid: userID,
                                    name: auth.currentUser.displayName,
                                    cards: deck
                                });
                            });
                        })
                        .then(() => {
                            setTimeout(() => {
                                window.location.href = 'room.html'
                            }, 250); //250ms wait to join room
                        })
                        .catch((error) => {
                            alert(error.message); //pop up on the webpage
                            console.log(error.code); //log the error code number
                            console.log(error.message); //logs the error message
                        })
                } else {
                    alert("Room is full");
                }
            } else {//room doesn't exist, return error
                alert("Invalid room code entered, please try again.");//alert user
            }
        });
    }
}

//create my signOut method
let signOut = () =>{
    if(confirm("Are you sure you want to sign out?") == true) {//make sure user wants to sign out
        auth.signOut(); //sign out from the database
        window.location.href = '../index.html'; //switch the window from home to login
    } else {}
}
//create our getDataInfo function to get data from firebase
let getDataInfo = () =>{
    onAuthStateChanged(auth, (user) => {
        if(user){
            const userID = user.uid;
            const dbref = ref(db, 'users/'+userID);
            onValue(dbref, (snapshot) => {
                let fNameData = snapshot.val().firstName;
                let lNameData = snapshot.val().lastName;
                let cashData = snapshot.val().cash;

                //now send data to h2 tags
                fNameInput.innerText = 'First Name: ' + fNameData;
                lNameInput.innerText = 'Last Name: ' + lNameData;
                cashInput.innerText = 'Cash: $' + cashData;
            });
        } else{
            console.log("Error getting user data");
        }
    })
}

//on window load, grab and post data
window.addEventListener('load', getDataInfo);
//when the Sign-Out button is clicked, run our function
SignOutButton.addEventListener('click', signOut);
//when createRoom button clicked, create room
createRoomButton.addEventListener('click', () => {
    try{
        createRoom()
    }catch (e) {
        console.error(e.message);
        alert(e.message);
    }
});
//when joinRoom button clicked, attempt to join room
joinRoomButton.addEventListener('click', joinRoom);
