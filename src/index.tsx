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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAuoJd0tqoF23elawzcpaDU02-Mu9azKlw",
    authDomain: "church-tournament.firebaseapp.com",
    projectId: "church-tournament",
    storageBucket: "church-tournament.appspot.com",
    messagingSenderId: "154721190099",
    appId: "1:154721190099:web:f00f921dc824cbd4bf1426",
    measurementId: "G-087KHJ547J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <Router>
          <Routes>
              <Route path="/" element={<App/>}></Route>
              <Route path="/admin" element={<Admin/>}/>
              <Route path="/create-tournament" element={<CreateTournament/>} />
          </Routes>
      </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
