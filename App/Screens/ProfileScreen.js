import React from 'react';
import { getAuth, signOut, } from 'firebase/auth';

import {
  View,
  Text,
  Button,
} from 'react-native';

const auth = getAuth();

const ProfileScreen = () => {
  const signOutUser = () => {
    signOut(auth)
    .catch(error => {
      console.log(error)
    });
  };

  return(
    <View>
      <Button title="Logout" onPress={signOutUser}/>
    </View>
  );
};

export default ProfileScreen;