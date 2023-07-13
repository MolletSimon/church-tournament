import React from 'react';
import './App.css';
import {Navigate} from "react-router-dom";

function App() {
  return (
    <div className="Content">
        <Navigate to={"/admin"}  />
    </div>
  );
}

export default App;
