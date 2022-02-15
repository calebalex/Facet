import React from 'react';
import AuthComponent from './AuthComponent';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginComponent = (props) => {
  const login = (email, pass) => {
      signInWithEmailAndPassword(props.fireAuth, email, pass)
      .then(userCred => {
        console.log(userCred.user);
      })
      .catch(error => {
        console.log(error)
      });
    };
    
    return (
      <AuthComponent 
        customStyles={props.customStyles}
        givenTitle="Login" 
        givenMethod={login} 
      />
    );
  };

export default LoginComponent;