import React from 'react';
import type {Node} from 'react';

import { LandingScreen, NavContainer } from './screenIndex.js';

import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getStorage } from 'firebase/storage';


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
//connectAuthEmulator(auth, 'http://127.0.0.1:8080');
//const storage = getStorage(app, "gs://tent-official.appspot.com/");

const App: () => Node = () => {
  const [user] = useAuthState(auth);  
  
  return(
    user ? <NavContainer />:<LandingScreen/>
  );
  
};

export default App;
