import React from 'react';
import { getAuth, signOut, updatePassword, updateProfile, } from 'firebase/auth';

import {
  View,
  Text,
  Button,
  Alert,
  Image
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';

import { ref, uploadBytes, getStorage, getDownloadURL} from 'firebase/storage';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import { base64urlEncodeWithoutPadding } from '@firebase/util';


const auth = getAuth();
const storage = getStorage();

const ProfileScreen = () => {

  const handleProfileUpdate = () => {
    Alert.alert("Options", null, 
        [
          {
            text: "Change Profile Icon",
            onPress: addPhoto
          },
          {
            text: "Change Password",
            onPress: handlePasswordChange
          },
          { 
            text: "Cancel", 
            style: 'cancel'
          }
      ]
    );
  }

  const updatePasswordFunc = async (pass, confirmedPass) => {
    if (pass == confirmedPass) {
      await updatePassword(auth.currentUser, confirmedPass)
      .then(() => {
        Alert.alert("Password has been updated", null, 
          [
            {
              text: "Ok"
            }
          ]
        );
      })
      .catch((error) => {console.log(error)})
    } else {
      Alert.alert("Passwords did not match", "Please try again", 
      [
        {
          text: "Ok"
        }
      ])
    }
  }

  const handleConfirm = (password) => {
    Alert.prompt("Confirm your password", null, 
      [
        {
          text: "Ok",
          onPress: (confirmedPass) => updatePasswordFunc(password, confirmedPass)
        },
        {
          text: "Cancel",
          style:'cancel'
        }
      ]
    )
  }

  const handlePasswordChange = () => {
    Alert.prompt("Enter a new password", null, 
      [
        {
          text: "Ok",
          onPress: (password) => handleConfirm(password)
        },
        {
          text: "Cancel",
          style:'cancel'
        }
      ]
    )
  }

  const addPhoto = () => {
    Alert.alert("Options",null,  
            [
                {
                  text: "Select Photo From Camera Roll",
                  onPress: selectPhoto
                },
                {
                  text: "Take Photo",
                  onPress: takePhoto,
                },
                { 
                  text: "Cancel", 
                  style: 'destructive'
                }
            ]
        );
  }

  const takePhoto = () => {
    Alert.alert("Feature not released yet",null,  
            [
                { 
                  text: "Ok", 
                  style: 'cancel'
                }
            ]
        );
  }

  const selectPhoto = async () => {
    
    ImageCropPicker.openPicker({
      multiple: false,
      includeBase64: true,
      forceJpg: true,
      compressImageQuality: 0.1
    }).then((image) => {
      uploadImage(image)
    })
    .catch((error) => {console.log(error)})
  
  }

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
    const storageRef = ref(storage, 'Users/' + auth.currentUser.uid + "/profile-icon.jpeg")

    urltoFile(`data:${image.mime};base64,${image.data}`, "profile-icon.jpeg", image.mime )
    .then(async (image) => {
      await uploadBytes(storageRef, image)
      .catch((error) => {console.log(error)})

      await getDownloadURL(storageRef)
      .then((url) => {
        updateProfile(auth.currentUser, {photoURL: url})
        .then(() => {console.log(auth.currentUser.photoURL)})
        .catch((error) => {console.log(error)})
      })
    })
    .catch((error) => {"something" + console.log(error)})
    
  }

  const signOutUser = () => {
    signOut(auth)
    .catch(error => {
      console.log(error)
    });
  };

  return(
    <View style={{alignItems: "center", marginTop: 10}}>
      
      <Image style={{width: 200, height: 200, borderRadius: 100, borderWidth: 5, borderColor: "#FFFFFF"}} source={{uri: auth.currentUser.photoURL}}/>
      <Text style={{fontSize: 20, fontWeight: "bold"}}>{auth.currentUser.displayName}</Text>
      
      <Button title="Update Profile" onPress={handleProfileUpdate}/>
      <Button title="Logout" onPress={signOutUser}/>
    </View>
  );
};

export default ProfileScreen;