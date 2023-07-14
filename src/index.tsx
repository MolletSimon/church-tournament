import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {CreateTournamentPage} from "./pages/Admin/CreateTournamentPage";
import {HomeAdminPage} from "./pages/Admin/HomeAdminPage";
import HomeUserPage from "./pages/User/HomeUserPage";
import TeamPage from "./pages/User/TeamPage";
import GroupPage from "./pages/User/GroupPage";
import LoginPage from "./pages/Admin/LoginPage";
import {HistoricPage} from "./pages/Admin/HistoricPage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { TournamentPage } from './pages/Admin/Tournament';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBWT7NriTel1mKi8ijNZs0LLK6nDErF4n0",
    authDomain: "pied-ballon.firebaseapp.com",
    projectId: "pied-ballon",
    storageBucket: "pied-ballon.appspot.com",
    messagingSenderId: "628152777400",
    appId: "1:628152777400:web:22a6959eaa93e6f64b124d",
    measurementId: "G-C5163WT8P1"
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
              <Route path="/:tournamentId" element={<HomeUserPage/>}/>
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/:tournamentId/:teamName" element={<TeamPage/>}/>
              <Route path="/:tournamentId/group/:groupId" element={<GroupPage/>}/>
              <Route path="/admin" element={<HomeAdminPage/>}/>
              <Route path="/create-tournament" element={<CreateTournamentPage/>} />
              <Route path="/tournament/:id" element={<TournamentPage/>} />
              <Route path="/tournament/:id/historique" element={<HistoricPage/>} />
          </Routes>
      </Router>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
