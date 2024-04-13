// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, get, ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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
let button1Input = document.getElementById('button1');//get button1
let button2Input = document.getElementById('button2');//get button2
let quitButtonInput = document.getElementById('quitButton');//get quit button

//global variables
let currentRoomCode = null;
let roomReady = false;

//create our getDataInfo function to get data from firebase
let getDataInfo = () =>{
    onAuthStateChanged(auth, (user) => {
        if(user){
            const userID = user.uid;
            let roomCreatorData = null;
            const dbref = ref(db, 'users/'+userID);

            onValue(dbref, (snapshot) => {
                currentRoomCode = snapshot.val().currentRoom; //get current room code

                setTimeout(()=>{console.log("getting data");}, 1000); // one second wait to get data

                currentRoomTag.innerText = currentRoomCode; //send data to h2 tag

                if(currentRoomCode != null) {
                    const dbrefroom = ref(db, 'rooms/' + currentRoomCode); //get ref of current room

                    //get creator of room
                    get(dbrefroom).then((snapshot)=>{
                        if(snapshot.exists) {
                            roomCreatorData = snapshot.val().roomCreator; //get room creator

                            setTimeout(() => {
                                console.log("getting room data");
                                roomReady = true;
                                console.log("room is ready " + roomReady); //room is ready for data transmission
                                setTimeout(() => {
                                    eventDetection(); //run eventDetection method every 50ms
                                }, 50);
                            }, 1000); //one second wait for room creator data


                            roomCreatorTag.innerText = roomCreatorData; //send data to h2 tag
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

let button1Event = evt => {
    evt.preventDefault();
    const userID = auth.currentUser.uid; //get uid of current user
    update(ref(db, 'rooms/' + currentRoomCode), {
        button1state: userID //set button1state to user id of who pressed
    })
        .catch((error) => {
            alert(error.message); //pop up on the webpage
            console.log(error.code); //log the error code number
            console.log(error.message); //logs the error message
        })
}

let button2Event = () => {
    set(ref(db, 'test/'))
}

let eventDetection = () => { //detects changes in the buttonState in the room
    if (roomReady) { //detects if room is ready
        const dbbutton1 = ref(db, 'rooms/' + currentRoomCode + '/button1state'); //reference button1state in current room
        const dbbutton2 = ref(db, 'rooms/' + currentRoomCode + '/button2state'); //reference button2state in current room
        onValue(dbbutton1, (data) => { //detect changes in button1state
            console.log(data.val() + " pressed button 1!"); //print who pressed button 1 to console
        });
        onValue(dbbutton2, (data) => { //detect changes in button2state
            console.log(data.val() + " pressed button 2!"); //print who pressed button 2 to console
        });
    }
}

let quitButtonEvent = () => { //function that handles user wanting to leave room
    if(confirm("Are you sure you want to leave?")) { //confirm that user actually wants to leave
        const userID = auth.currentUser.uid; //get uid of current user
        const dbrefuser = ref(db, 'users/' + userID); //get dbref of current user
        const dbroomref = ref(db, 'rooms/' + currentRoomCode); //get database reference of current room
        let roomCreator = null;
        get(dbroomref).then((snapshot) => { //get uid of room creator
            roomCreator = snapshot.val().roomCreator; //set roomCreator to uid of room creator
            console.log(roomCreator);
        });
        update(dbrefuser, {currentRoom: null}); //set current room of user back to null
        setTimeout(() => {
            if (roomCreator == userID) { //detect if person leaving is room creator
                remove(dbroomref); //delete current room from database
            }
        }, 500); //500 ms wait so that room creator actually exists
        setTimeout(() => {window.location.href = 'home.html'}, 500); //500 ms wait to send user back to home page
    }
}

//on window load, grab and post data
window.addEventListener('load', getDataInfo);
//on button1 press, send event
button1Input.addEventListener('click', button1Event);
//on button2 press, send event
button2Input.addEventListener('click', button2Event);
//on quitButton press, either delete room if creator, or leave room
quitButtonInput.addEventListener('click', quitButtonEvent);
