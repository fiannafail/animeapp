import { initializeApp } from 'firebase';
import Firebase from 'firebase'
const app = initializeApp({
	apiKey: "AIzaSyD7NAnw3MenR-haZDX-4KEKNN9geClfDKM",
	authDomain: "newproject-22479.firebaseapp.com",
	databaseURL: "https://newproject-22479.firebaseio.com",
	projectId: "newproject-22479",
	storageBucket: "newproject-22479.appspot.com",
	messagingSenderId: "857718161247"
});


export const db = app.database()
export const usersRef = db.ref('users')