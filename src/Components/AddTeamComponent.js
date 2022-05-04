import React, { useEffect, useState } from 'react';
import {Text, FlatList, View, StyleSheet, Modal, Alert, Image} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import { FieldItem, AddButton, PhotoButton} from '../componentIndex';
import { launchCamera,launchImageLibrary } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { getApp } from 'firebase/app';
import {doc, setDoc, collection, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL,} from 'firebase/storage';
import { getAuth } from 'firebase/auth';


const app = getApp();
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

const AddTeamComponent = ({fireAuth, modalVisibility, toggleModalVisibility}) => {
  const [teamDescription, setTeamDescription] = useState();
  const [teamName, setTeamName] = useState();
  const [teamPasscode, setTeamPasscode] = useState();
  const [image, setImage] = useState();

  const handleCloseModal = () => {
    setTeamDescription();
    setTeamName();
    setImage();
    toggleModalVisibility();
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

  const uploadImage = (teamID, images) => {
    const storageRef = ref(storage, 'Teams/' + teamID + "/team-photo.jpeg")

    urltoFile(`data:${image.mime};base64,${image.data}`,  "team-photo.jpeg", image.mime )
    .then((image) => {
        uploadBytes(storageRef, image)
        .then(async () => {
            await getDownloadURL(storageRef)
            .then((value) => {
                console.log(value)
                const docRef = doc(firestore, "Teams", teamID);
                updateDoc(docRef, {
                    "team_image": value,
                    "hasImage": true
                })
            })
        })
    })
    .catch((error) => {"something" + console.log(error)})
  }

  
  const runMethod = async () => {
    
    const newDocRef = doc(collection(firestore, "Teams",));
    
    const team = {
        teamID: newDocRef.id,
        team_name: teamName,
        team_description: teamDescription,
        Owner: fireAuth.currentUser.uid,
        Members: [fireAuth.currentUser.uid],
        team_passcode: teamPasscode,
        hasImage: false
    };
    
    await setDoc(newDocRef, team)
      .then((reference, data) => {
        const memberRef = doc(collection(firestore, "Teams", team.teamID, "Members"));
        
        const member = {
          member_id: fireAuth.currentUser.uid,
          display_name: fireAuth.currentUser.displayName,
          admin: true,
          imageURL: fireAuth.currentUser.photoURL
        }
        setDoc(memberRef, member)
        //console.log(reference);
        //console.log(data);
      })
      .catch((error) => {
        console.log(error)
      });
      if(image) {
        uploadImage(newDocRef.id, image)
      }
   
  };

  const handleAdd = () => {
    runMethod().then(
      handleCloseModal()
    )
    .catch((error) => {console.log(error)});
    
  }

  const addPhotos = () => {
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
      setImage(image)
    })
  
  }

  return (
    <Modal animationType="slide" visible={modalVisibility} presentationStyle={'pageSheet'}>

    <>
      <View style={{backgroundColor: "#f2f2f2", flex:1}}>
          <View style={{flexDirection:'row', justifyContent:"space-between", alignItems:"center", width: '100%', backgroundColor: "#FFFFFF", borderBottomColor: "#ababab", borderBottomWidth: 0.15}}>
              <Button 
                  style={{ marginHorizontal: 10, marginVertical: 6, marginLeft: 10}} 
                  icon={
                      <Icon 
                          name='chevron-left' 
                          type='font-awesome'
                      />
                  } 
                  onPress={handleCloseModal} 
                  type="clear"
              />
             {//} <Text style={{fontSize: 18, fontWeight: "600"}}>Add Team</Text>
}
              <Button 
                  style={{marginHorizontal: 10, marginVertical: 6, marginLeft: 10}} 
                  icon={
                      <Icon 
                          name='check' 
                          type='font-awesome'
                      />
                  } 
                  onPress={handleAdd} 
                  type="clear"
              />
          </View>
      
          {image != null ?
              <>
                <View style={{flexDirection: "row", justifyContent: "center", marginVertical: 10}} >
                  <View style={{alignSelf:"center", width: 200, height: 150, borderWidth: 8, borderRadius: 10, borderColor: "#FFFFFF", alignContent: "center", shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    shadowOpacity: 0.2,}}>
                    <Image style={{width: "100%", height: "100%",}} source={{uri: `data:${image.mime};base64,${image.data}`}} />
                  </View>
                  <View style={{marginLeft: 10,width: 50, height: 50, backgroundColor: "#FFFFFF",justifyContent: 'center', alignSelf:"center",lalignContent: "center", marginBottom: 10}} borderRadius={100}>
                    
                      <Button 
                          icon={{
                              name: 'pencil',
                              type: 'foundation',
                              color: 'black',
                              style: {opacity: 0.2},
                              size: 25,
                              
                          }} 
                          containerStyle={{
                              alignSelf: "center"
                          }} 
                          type="clear"
                          onPress={addPhotos}
                      />
                        
                    </View>
                </View>
                
              </>
              :
              <>
              <PhotoButton onPress={addPhotos} />
              </>
            }        
          
          <View style={{margin: 10}}>
            <Input 
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.innerInputContainer}
                    placeholder='Team Name' 
                    //leftIcon={{type: 'entypo', name: 'mail'}}
                    onChangeText={(text) => {
                      setTeamName(text);
                    }}
                  />
            <Input 
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.innerInputContainer}
                    placeholder='Team Description' 
                    //leftIcon={{type: 'entypo', name: 'mail'}}
                    onChangeText={(text) => {
                      setTeamDescription(text);
                    }}
                  />   
            <Input 
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.innerInputContainer}
                    placeholder='Team Passcode' 
                    //leftIcon={{type: 'entypo', name: 'mail'}}
                    onChangeText={(text) => {
                      setTeamPasscode(text);
                    }}
                  />     
          </View>
      </View>
 
   

    </>
 </Modal>
  );
};
  
const styles = StyleSheet.create({
    inputContainer: {
    margin: 5,
    width: 350,
    alignSelf: 'center',
    },

    innerInputContainer:{
    borderRadius:0, 
    borderWidth: 0, 
    borderBottomWidth:0, 
    borderColor:"#000", 
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    shadowOpacity: 0.2,
    },

    buttonContainer: {
    margin: 0,
    borderRadius: 0,
    padding: 5, 
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    shadowOpacity: 0.2,
    },

    innerButtonContainer: {
    alignSelf: 'center',
    width: 200,
    borderRadius: 10,
    borderWidth: 0,
    backgroundColor:"#FFFFFF",
    },
});

export default AddTeamComponent;