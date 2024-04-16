import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
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

let cashTag = document.getElementById('cash');
let duckTag = document.getElementById('ducks');
let cashButton = document.getElementById('redeemCash');
let duckButton = document.getElementById('buyDuck');
let lastClickTime = localStorage.getItem("lastClickTime");

if (lastClickTime) {
    lastClickTime = new Date(lastClickTime); // Convert the stored time string to a Date object
    let timeDiff = new Date() - lastClickTime; // Calculate the time difference between now and the last click time
    if (timeDiff < 24 * 60 * 60 * 1000) { // If less than 24 hours have passed since the last click
        cashButton.disabled = true; // Disable the button
    }
}

let getDataInfo = () =>{
    let timeEntered = new Date(); //get date page was entered
    onAuthStateChanged(auth, (user) => {
        if(user){
            const userID = user.uid;
            const dbref = ref(db, 'users/'+userID);
            onValue(dbref, (snapshot) => {
                //get user data
                let cashData = snapshot.val().cash;
                let duckData = snapshot.val().ducks;
                let timeToDaily = snapshot.val().nextDailyRedeemTime;

                //now send data to h2 tags displays on the shop page
                cashTag.innerText = 'Cash: $' + cashData;
                duckTag.innerText = 'Ducks: ' + duckData;

                if(timeEntered.getTime() < timeToDaily){ //if the current time is before the daily time, disable the button
                    cashButton.disabled = true;
                }
            });
        } else{
            console.log("Error getting user data");
        }
    })
}
let addCash = () => {
    let timeClicked = new Date(); //get date button was clicked
    const userID = auth.currentUser.uid;
    const userRef = ref(db, 'users/'+userID+'/cash');

    runTransaction(ref(db, 'users/'+userID+'/nextDailyRedeemTime'), (timeToRedeem) => { //run transaction to get time when next cash redeem may occur
        if(timeToRedeem === null) { //if node doesn't exist, create it with current time + 24 hours
            timeToRedeem = timeClicked; //set timeToRedeem to current time
            return timeToRedeem.setTime(timeClicked.getTime()+(24*60*60*1000)); //return time plus 24 hours
        } else if(timeClicked.getTime() > timeToRedeem){ //check if the current time is past the time for next redeem in firebase
            cashButton.disabled = true; //disable cash button
            return timeClicked.getTime() + (24*60*60*1000); //set time in firebase to 24 hours from the time button was clicked
        } else {
            cashButton.disabled = true;
            alert("It has not been 24 hours since last redemption, please wait " + (Math.round((timeToRedeem - timeClicked.getTime())/(1000*60*60))) + " hours!");
            throw new Error("It has not been 24 hours since last redemption, please wait " + (Math.round((timeToRedeem - timeClicked.getTime())/(1000*60*60))) + " hours!");
        }
    }).then(() => { //if time check is successful, add cash
        // Run the transaction to update the cash value
        runTransaction(userRef, (currentCash) => {
            // If the currentCash is null, it means the cash node doesn't exist yet
            // We'll initialize it with 0
            if (currentCash === null) {
                currentCash = 0;
            }
            // Update the cash value by adding 200
            return currentCash + 200;
        }).then((transactionResult) => {
            console.log('Cash updated successfully. New value: ', transactionResult.snapshot.val());
        }).catch((error) => {
            console.error('Transaction failed abnormally:', error);
        });
    }).catch((error) => { //if time check fails return error
        console.error('Time check failed: ', error);
    })
}

let buyDuck = () => {//function to buy a duck, costs $1000
    const userID = auth.currentUser.uid; //get uid of current user
    const dbref = ref(db, 'users/'+userID); //get dbref of current user
    let currentCash = null
    get(dbref).then((snapshot) => { //get current cash of user
        currentCash = snapshot.val().cash;
    });
    setTimeout(() => {
        if (currentCash >= 1000) {
            const refCash = ref(db, 'users/' + userID + '/cash'); //ref of current user's cash
            runTransaction(refCash, (CCash) => { //remove $1000 from user cash account
                return CCash - 1000;
            });
            const refDuck = ref(db, 'users/' + userID + '/ducks'); //ref of current user's ducks
            runTransaction(refDuck, (currentDucks) => {
                if (currentDucks == null) {
                    currentDucks = 0;
                } //if currentDucks is null, node doesn't exist yet, so create it
                return currentDucks + 1; //add 1 duck to user's duck count
            })
        } else {
            alert("You do not have enough cash to purchase this!");
        }
    }, 5); //5 ms wait for data fetch
}

window.addEventListener('load', getDataInfo); //on page load, get current cash of user

cashButton.addEventListener('click', addCash); //when cash button pressed, add $200 to user account

duckButton.addEventListener('click', buyDuck); //when duck button pressed, attempt to buy a duck