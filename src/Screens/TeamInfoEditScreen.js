import React, { useState, useEffect,} from 'react';
import { FlatList, View, Image , Alert} from 'react-native';
import { Icon, Button} from 'react-native-elements';
import { Input } from 'react-native-elements';
import ImageCropPicker from 'react-native-image-crop-picker';
import { FieldItem, AddButton, PhotoButton} from '../componentIndex';
import {doc, deleteDoc, updateDoc, getFirestore,} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { deleteObject, getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';


const firestore = getFirestore();
const auth = getAuth();
const storage = getStorage();

const TeamInfoEditScreen = ({route, navigation}) => {
    const team = route.params.team;
    const [teamName, setTeamName] = useState(team.team_name);
    const [teamDescription, setTeamDescription] = useState(team.team_description);
    const [teamPasscode, setTeamPasscode] = useState(team.team_passcode);
    const teamID = team.teamID;

    const [image, setImage] = useState(team.team_image);
    const [imageURI, setImageURI] = useState(team.team_image);
    const [imageUpdated, setImageUpdated] = useState(false);

    const updatedTeam = {
        teamID: teamID,
        team_name: teamName,
        team_description: teamDescription,
        team_passcode: teamPasscode,
    };

    const handleGoBack = () => {
        navigation.goBack();
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
    
    const uploadImage = async (docID, image) => {
        const storageRef = ref(storage, 'Teams/' + teamID + "/team_photo.jpeg")
    
        urltoFile(`data:${image.mime};base64,${image.data}`,  "team_photo.jpeg", image.mime )
        .then((image) => {
            uploadBytes(storageRef, image)
            .then(async () => {
                await getDownloadURL(storageRef)
                .then((value) => {
                    console.log(value)
                    const docRef = doc(firestore, "Teams", teamID,);
                    updateDoc(docRef, {
                        "team_image": value,
                        "hasImage": true
                    })
                })
            })
            .catch((error) => {console.log(error)})
        })
        .catch((error) => {console.log(error)})
        
      }

    const handleUpdate = () => {
        console.log("here")
        const docRef = doc(firestore, "Teams", teamID);
        console.log("here2")
        
            console.log("here 3")
            updateDoc(docRef, updatedTeam)
            .then(() => {
                navigation.goBack()
            })
            
            .catch((error) => {
                console.log(error);
            });
            if (imageUpdated) {
                uploadImage(updatedTeam.team_ID, image)
            }
        
    };


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
            setImageURI(`data:${image.mime};base64,${image.data}`)
            setImage(image)
            setImageUpdated(true);
        })
      
      }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return(
                    <Button 
                        title={"Done"}
                        titleStyle={{fontWeight: "bold"}}
                        type={"clear"}
                        containerStyle={{marginHorizontal: 15}}
                        onPress={handleUpdate} 
                    />
                );
            },

            headerLeft: () => {
                return(
                    <Button 
                    title={"Cancel"}
                    type={"clear"}
                    containerStyle={{marginHorizontal: 15}}
                    onPress={handleGoBack} />
                );
            }
        });
    }, [navigation, updatedTeam]);

    return(
        <>
            {team.hasImage != false || image != null ?
              <>
                <View style={{flexDirection: "row", justifyContent: "center", marginVertical: 10}} >
                  <View style={{alignSelf:"center", width: 200, height: 150, borderWidth: 8, borderRadius: 10, borderColor: "#FFFFFF", alignContent: "center", shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    shadowOpacity: 0.2,}}>
                    <Image style={{width: "100%", height: "100%",}} source={{uri: imageURI}} />
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

            <Input label="Team Name" value={teamName} onChangeText={(text)=>setTeamName(text)}/>
            <Input multiline={true} label="Description" value={teamDescription} onChangeText={(text)=>setTeamDescription(text)}/>
            <Input label="Team Passcode" value={teamPasscode} onChangeText={(text)=>setTeamPasscode(text)} />
        </>
    ); 
};

export default TeamInfoEditScreen;