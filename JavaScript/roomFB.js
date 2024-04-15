// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, get, ref, onValue, update, remove, child } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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
let currentRoomTag = document.getElementById('roomCode'); //links with my h2 tags above
let roomCreatorTag = document.getElementById('roomCreatorText');
let quitButtonInput = document.getElementById('quitButton');//get quit button

//global variables
let currentRoomCode = null;
let roomCreator = null;
let userID = null;
let roomReady = false;

//create our getDataInfo function to get data from firebase
let getDataInfo = () =>{
    onAuthStateChanged(auth, (user) => {
        if(user){
            userID = user.uid;
            roomCreator = null;
            const dbref = ref(db, 'users/'+userID);

            onValue(dbref, (snapshot) => {
                currentRoomCode = snapshot.val().currentRoom; //get current room code

                currentRoomTag.innerText = currentRoomCode; //send data to h2 tag

                if(currentRoomCode != null) {
                    const dbrefroom = ref(db, 'rooms/' + currentRoomCode); //get ref of current room

                    //get creator of room
                    get(dbrefroom).then((snapshot)=>{
                        if(snapshot.exists) {
                            roomCreator = snapshot.val().roomCreator; //get room creator

                            setTimeout(() => {
                                console.log("getting room data");
                                roomReady = true;
                                console.log("room is ready " + roomReady); //room is ready for data transmission
                            }, 500); //500ms wait for room creator data


                            roomCreatorTag.innerText = roomCreator; //send data to h2 tag
                        }
                    });
                } else{
                    console.log("Error getting creator of room");
                }

            });

        } else{
            console.log("Error getting user data");
        }
    })
}


let quitButtonEvent = () => { //function that handles user wanting to leave room
    if(confirm("Are you sure you want to leave?")) { //confirm that user actually wants to leave
        const dbrefuser = ref(db, 'users/' + userID); //get dbref of current user
        const dbroomref = ref(db, 'rooms/' + currentRoomCode); //get database reference of current room
        update(dbrefuser, {currentRoom: null}); //set current room of user back to null
        if (roomCreator == userID) { //detect if person leaving is room creator
            remove(dbroomref) //delete current room from database
                .then(() => {
                    window.location.href = 'home.html';
                });
        } else {
            update(child(dbroomref, 'currentPlayers/player2'), {
                uid: null,
                name: null
            })
                .then(() => {
                    window.location.href = 'home.html';
                });
        }
    }
}

//on window load, grab and post data
window.addEventListener('load', getDataInfo);
//on quitButton press, either delete room if creator, or leave room
quitButtonInput.addEventListener('click', quitButtonEvent);
