import React from 'react';
import type {Node} from 'react';

import { LandingScreen, MainScreen } from './App/screenIndex.js';

import { initializeApp } from 'firebase/app';
import { getAuth, } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCeOdU0PLChFMn9kLLdaUG4Q_JM79CB410",
  authDomain: "tent-official.firebaseapp.com",
  projectId: "tent-official",
  storageBucket: "tent-official.appspot.com",
  messagingSenderId: "34117969694",
  appId: "1:34117969694:web:17a7d3c717dc7c619a4b0f",
  measurementId: "G-SR1PXN8XZP"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();


const App: () => Node = () => {
  const [user] = useAuthState(auth);  
  
  return(
    user ? <MainScreen />:<LandingScreen/>
  );
  
};

export default App;
