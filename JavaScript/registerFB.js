import { createCard } from "./cardCreation.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
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
let EmailInput = document.getElementById('emailInput');
let PasswordInput = document.getElementById('passwordInput');
let FNameInput = document.getElementById('fNameInput');
let LNameInput = document.getElementById('lNameInput');
let MainForm = document.getElementById('MainForm');

//create our registerUser function to hit Firebase
let RegisterUser = evt =>{
    evt.preventDefault(); //takes care of our promise
    createUserWithEmailAndPassword(auth, EmailInput.value, PasswordInput.value)
        .then((credentials)=>{
            set(ref(db, 'users/'+credentials.user.uid), {
                firstName: FNameInput.value,
                lastName: LNameInput.value,
                currentRoom: null, //not in a room when account is created
                cash: 2000, //starting user cash
                ducks: 0, //starting user ducks
                cards: {
                    0: createCard(0),
                    1: createCard(1),
                    2: createCard(2),
                    3: createCard(3),
                    4: createCard(4)
                }
            })
            updateProfile(auth.currentUser, {
                displayName: `${FNameInput.value} ${LNameInput.value}`
            })
            setTimeout(()=> {window.location.href='home.html'}, 250); //250ms wait, so we can write data before switching pages
        })
        .catch((error)=>{
            alert(error.message); //pop up on the webpage
            console.log(error.code); //log the error code number
            console.log(error.message); //logs the error message
        })
}

MainForm.addEventListener('submit', RegisterUser); //when the CreateUser button is clicked, run our function
