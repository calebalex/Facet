import React from 'react';

import AuthComponent from './AuthComponent.js';
import RegComponent from './RegComponent.js';

import { createUserWithEmailAndPassword, getAuth, updateCurrentUser, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, getStorage,  } from 'firebase/storage';

const storage = getStorage();

const RegisterComponent = (props) => {

  const urltoFile = async (url, filename, mimeType) => {
    return (fetch(url)
        .then((response) => {
            return response.blob();
            
        })
        .then((buffer) => {
            return new File([buffer], filename, {type:mimeType});
        })
    );
  }
  
  const uploadImage = async (image) => {
    const storageRef = ref(storage, 'Users/' + props.fireAuth.currentUser.uid + "/profile-icon.jpeg")

    urltoFile(`data:${image.mime};base64,${image.data}`, "profile-icon.jpeg", image.mime )
    .then(async (image) => {
      await uploadBytes(storageRef, image)
      .catch((error) => {console.log(error)})

      await getDownloadURL(storageRef)
      .then((url) => {
        updateProfile(props.fireAuth.currentUser, {photoURL: url})
        .then(() => {console.log(props.fireAuth.currentUser.photoURL)})
        .catch((error) => {console.log(error)})
      })
    })
    .catch((error) => {"something" + console.log(error)})
    
  }
          
  const register = async (email, pass, first_name, last_name, image) => {
    await createUserWithEmailAndPassword(props.fireAuth, email, pass)
    .then(userCred => {
      updateProfile(props.fireAuth.currentUser, {
        displayName: first_name + " " + last_name,
      })
      console.log(userCred.user);
    })
    .catch(error => {
      console.log(error)
    });

    await uploadImage(image)

  };

  return (
    <RegComponent 
      customStyles={props.customStyles}
      givenTitle="Register"
      givenMethod={register}
    />
    
  );
};

export default RegisterComponent;