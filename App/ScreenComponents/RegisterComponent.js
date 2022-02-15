import React from 'react';

import AuthComponent from './AuthComponent.js';

import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterComponent = (props) => {
  const register = (email, pass) => {
    createUserWithEmailAndPassword(props.fireAuth, email, pass)
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
      givenTitle="Register" 
      givenMethod={register}
    />
  );
};

export default RegisterComponent;