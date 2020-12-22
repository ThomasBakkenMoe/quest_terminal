import logo from './logo.svg';
import React, {useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDsJeeJTAr-XEM2wMbPu2A7dkiED9kIFHU",
  authDomain: "quest-terminal.firebaseapp.com",
  databaseURL: "https://quest-terminal.firebaseio.com",
  projectId: "quest-terminal",
  storageBucket: "quest-terminal.appspot.com",
  messagingSenderId: "325595410332",
  appId: "1:325595410332:web:fe79f39fbcabb8dcb9a259"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        
      </header>

      <section>
        {user ? <Terminal /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithMail = () => {
    auth.signInWithEmailAndPassword("izabelle_nybrodahl@hotmail.com", "VY$7A*3Z");
    console.log("Logged in!");
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithMail}>Sign in</button>
    </>
  )
}

function Terminal(){
  return(
    <p>"WOW! That worked!"</p>
  )
}
export default App;
