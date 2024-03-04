import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
//import { ref, runTransaction } from 'firebase/database';

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
let cashInput = document.getElementById('cash');
let cashRedeem = document.getElementById('redeemCash');
let getDataInfo = () =>{
    onAuthStateChanged(auth, (user) => {
        if(user){
            const userID = user.uid;
            const dbref = ref(db, 'users/'+userID);
            onValue(dbref, (snapshot) => {
                let cashData = snapshot.val().cash;

                setTimeout(()=>{console.log("getting data");}, 500); //500ms wait to fetch data

                //now send data to h2 tags
                cashInput.innerText = 'Cash: $' + cashData;
            });
        } else{
            console.log("Error getting user data");
        }
    })
}
let addCash = () => {
    const userID = auth.currentUser.uid;
    const userRef = ref(db, 'users/'+userID+'/cash');

    // Run the transaction to update the cash value
    runTransaction(userRef, (currentCash) => {
        // If the currentCash is null, it means the cash node doesn't exist yet
        // We'll initialize it with 0
        if (currentCash === null) {
            currentCash = 0;
        }
        // Update the cash value by adding 100
        const newCash = currentCash + 100;
        return newCash; // Return the updated cash value
    }).then((transactionResult) => {
        console.log('Cash updated successfully. New value: ', transactionResult.snapshot.val());
    }).catch((error) => {
        console.error('Transaction failed abnormally:', error);
    });
};



window.addEventListener('load', getDataInfo);
cashRedeem.addEventListener('click', addCash); //This is meant to occur when teh redeem cash button is clicked