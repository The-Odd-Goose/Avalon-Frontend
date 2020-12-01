import React from 'react';
import './App.css';
import { MainMenu } from './components/MainMenu';
import { firebase, firestore, auth } from "./firebase-init";

function App() {
  return (
    <div className="App">
      <MainMenu />
    </div>
  );
}

export default App;
