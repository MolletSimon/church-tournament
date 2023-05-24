import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {CreateTournament} from "./pages/Admin/CreationTournament/CreateTournament";
import {Admin} from "./pages/Admin/Admin";
import {TournamentDetails} from "./pages/Tournament/Tournament";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAqsqFzjM4p5CMCwVjCt9si8l9oaOyb9E",
    authDomain: "church-tournament-test.firebaseapp.com",
    projectId: "church-tournament-test",
    storageBucket: "church-tournament-test.appspot.com",
    messagingSenderId: "1053745518061",
    appId: "1:1053745518061:web:c6f615ea32501da30cc3e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.Fragment>
      <Router>
          <Routes>
              <Route path="/" element={<App/>}></Route>
              <Route path="/admin" element={<Admin/>}/>
              <Route path="/create-tournament" element={<CreateTournament/>} />
              <Route path="/tournament/:id" element={<TournamentDetails/>} />
          </Routes>
      </Router>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
