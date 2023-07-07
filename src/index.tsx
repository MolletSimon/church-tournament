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
import {TournamentDetails} from "./pages/Tournament/Admin/Tournament";
import HomePage from "./pages/Tournament/User/HomePage";
import TeamPage from "./pages/Tournament/User/TeamPage";
import GroupPage from "./pages/Tournament/User/GroupPage";
import LoginPage from "./pages/Admin/LoginPage";
import {Historique} from "./pages/Tournament/Admin/Historique";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAr0_gTc3SwHQcmnLJl_Pl2DQrShAsywf0",
    authDomain: "tournoi-intereglises.firebaseapp.com",
    projectId: "tournoi-intereglises",
    storageBucket: "tournoi-intereglises.appspot.com",
    messagingSenderId: "6441628913",
    appId: "1:6441628913:web:0c868441dde5a48bb5e550",
    measurementId: "G-GRC9KXY36C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.Fragment>
      <Router>
          <Routes>
              <Route path="/" element={<App/>}></Route>
              <Route path="/:tournamentId" element={<HomePage/>}/>
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/:tournamentId/:teamName" element={<TeamPage/>}/>
              <Route path="/:tournamentId/group/:groupId" element={<GroupPage/>}/>
              <Route path="/admin" element={<Admin/>}/>
              <Route path="/create-tournament" element={<CreateTournament/>} />
              <Route path="/tournament/:id" element={<TournamentDetails/>} />
              <Route path="/tournament/:id/historique" element={<Historique/>} />
          </Routes>
      </Router>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
