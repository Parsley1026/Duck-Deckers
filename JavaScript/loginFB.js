// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
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
const auth = getAuth(app); // grab auth from firebase
let EmailInput = document.getElementById('emailInput'); //grabs info off the page
let PasswordInput = document.getElementById('passwordInput');
let MainForm = document.getElementById('MainForm');
//create our sign in function
let SignInUser = evt =>{
    evt.preventDefault();
    signInWithEmailAndPassword(auth,EmailInput.value,PasswordInput.value)
        .then((credentials)=>{
            console.log(credentials);//log them credentials
            window.location.href="home.html";
        })
        .catch((error)=>{ //catch the error
            alert(error.message);
            console.log(error.code);
            console.log(error.message);
        })
}
MainForm.addEventListener('submit', SignInUser);


window.addEventListener('load',UpdateSplash); //I added splash text that updates everytime the page refreshes. feel free to add more quotes in the array below.

function UpdateSplash(){
    splash = splashTexts[Math.floor(Math.random() * splashTexts.length)];
    document.getElementById('splashtext').innerHTML = splash;
}
var splash = "";
const splashTexts = ["Ze brootoof devish is redy to payer","Are you serious right now?","What's quackin?","Gymbro always skips leg day!",
                                "You're either a smart fella, or a fart smella!", "We log your password!", "..But I'm a creep!", "Hai!!! Hai!! Hai!! ^-^",
                                ":3", "Number 9, Number 9, Number 9","Does he know the method?", "RAHHHHH","Heck yeah!", "Spiral out!", "Made with JS!", "All hail Zickert!",
                                "Fall off your horse!", "I refuse!", "Zoo Wee Mama!", "Ha ha, charade you are!", "I stay noided!", "I've got blisters on my fingers!",
                                "It come with eggroll!", "Womp womp!", "Giggity!", "Yesterday I woke up sucking a lemon!", "Poorly appareled porky poor people!", "Gooder should be a word"];
