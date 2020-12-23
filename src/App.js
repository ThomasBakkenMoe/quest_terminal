import logo from './logo.svg';
import React, {useRef, useState} from 'react';
import Terminal from 'terminal-in-react';
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

let questions;
let currentQuestionNumb;

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">

      <header>
      </header>

      {user ? <TerminalObject /> : <SignIn />}
      
    </div>
  );
}

function SignIn() {

  const [password, setPassword] = useState("");
  const [user] = useAuthState(auth);

  const signInWithMail = () => {
    auth.signInWithEmailAndPassword("izabelle_nybrodahl@hotmail.com", password);
    if(user){
      firestore.collection("questions").get().then((querySnapshot) => {
        questions = querySnapshot.docs.map(doc => doc.data())      
        const found = questions.find(element => element.solved == false)
        currentQuestionNumb = questions.indexOf(found)
        console.log("Firestore fetch")
        console.log(questions)
        console.log(found)
        console.log(currentQuestionNumb)
      })
    }
  }

  return (
    <>
      <input maxLength='8' onChange={(e) => setPassword(e.target.value)}></input>
      <button className="sign-in" onClick={signInWithMail}>Enter</button>
    </>
  )
}

function TerminalObject(){
  const [user] = useAuthState(auth);

  //Fetch questions and store them in the global object 'user'
  if(user){
    firestore.collection("questions").get().then((querySnapshot) => {
      questions = querySnapshot.docs.map(doc => doc.data())      
      const found = questions.find(element => element.solved == false)
      currentQuestionNumb = questions.indexOf(found)
      console.log("Firestore fetch")
      console.log(questions)
      console.log(found)
      console.log(currentQuestionNumb)
    })
  }

  let question = () => {
    if(!questions[currentQuestionNumb]){
      return `Your quest is complete!
Your final passphrase is: 'Uranus bure vært kalt King George'
Give this passphrase to your Father.
Merry Christmas!`
    }else{
      return questions[currentQuestionNumb].question;
    }
    
  }
  return(
    <Terminal
          className="terminal"
          color='white'
          backgroundColor='#181717'
          barColor='black'
          style={{
            fontWeight: "bold",
            fontSize: "1em",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            margin: 0,
            padding: 0,
            width: "1920px",
            overflow: "auto",
            }}
          hideTopBar={true}
          allowTabs={false}
          startState = "maximised"
          commands={{
            'question': question,
          }}
          descriptions={{
            'question': 'Prints out your current question',
          }}
          commandPassThrough ={cmd => {
            console.log(cmd[0])
            let answer = cmd.join(' ').toLowerCase();
            console.log(answer)
            if(answer === questions[currentQuestionNumb].answer){
              console.log("Answer correct!")
              console.log(questions[currentQuestionNumb].answer)
              questions[currentQuestionNumb].solved = true
              firestore.collection('questions').doc(`${currentQuestionNumb}`).update({solved: true})
              currentQuestionNumb++

              if(!questions[currentQuestionNumb]){
                return `Answer correct!
Your quest is complete!
Your final passphrase is: 'Uranus bure vært kalt King George'
Give this passphrase to your Father.
Merry Christmas!`
              }else{
                return `Answer correct!
              Your next question is:
              ${questions[currentQuestionNumb].question}`
              }
            }
            return `Answer incorrect`}}
          msg='Welcome back to the quest terminal! Type help to see all your options'
        />
  )
}
export default App;
