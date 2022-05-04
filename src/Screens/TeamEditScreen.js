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

const TeamEditScreen = ({route, navigation}) => {
    const entry = route.params.entry
    const [entryName, setEntryName] = useState(entry.entry_name);
    const [entryFields, setEntryFields] = useState(entry.entry_fields);
    const entryID = entry.entry_ID;
    const teamID = route.params.teamID;

    const [image, setImage] = useState(entry.image);
    const [imageURI, setImageURI] = useState(entry.image);
    const [imageUpdated, setImageUpdated] = useState(false);

    const updatedEntry = {
        entry_ID: entryID,
        entry_name: entryName,
        entry_fields: entryFields,
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
        const storageRef = ref(storage, 'Teams/' + teamID + "/Entries/" + docID + ".jpeg")
    
        urltoFile(`data:${image.mime};base64,${image.data}`, docID + ".jpeg", image.mime )
        .then((image) => {
            uploadBytes(storageRef, image)
            .then(async () => {
                await getDownloadURL(storageRef)
                .then((value) => {
                    console.log(value)
                    const docRef = doc(firestore, "Teams", teamID, "Entries", docID);
                    updateDoc(docRef, {
                        "image": value,
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
        const docRef = doc(firestore, "Teams", teamID, "Entries", entryID);
        console.log("here2")
        if (JSON.stringify(entry) != JSON.stringify(updatedEntry)) {
            console.log("here 3")
            updateDoc(docRef, updatedEntry)
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => {
                console.log(error);
            });
            if (imageUpdated) {
                uploadImage(updatedEntry.entry_ID, image)
            }
        }
        else {
            console.log("Not updated");
            handleGoBack();
        }
    };

    const handleDelete = () => {
        const docRef = doc(firestore, "Teams", teamID, "Entries", entryID);
        if(entry.hasImage == true) {
        
            const storageRef = ref(storage, "Teams/" + teamID + "/Entries/" + entryID + ".jpeg");
            deleteObject(storageRef)
            .then(() => {
                deleteDoc(docRef)
                .then(() => {
                    navigation.navigate("Team Entries", {teamID: teamID});
                })
                .catch((error) => {
                console.log(error);
                });
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            deleteDoc(docRef)
                .then(() => {
                    navigation.navigate("Team Entries", {teamID: teamID});
                })
                .catch((error) => {
                console.log(error);
                });
        }

    };

    const handleAddField = () => {
        const fields = [...entryFields];
        fields.push(
          {fieldName: "", fieldValue: ""}
        );
        setEntryFields(fields);
        
      }
    
      const handleRemoveField = (index) => {
        const fields = [...entryFields];
        fields.splice(index, 1);
        setEntryFields(fields);
      }
    
      const handleInputChange = (index, value, target) => {
        const fields = [...entryFields];
        const updatedField = target;
        fields[index][updatedField] = value;
    
        setEntryFields(fields);
        
      };

    const renderItem = (field, index) => {

        let name = null;
        let value = null;
    
        Object.keys(field).map((key) => {
          if(key === 'fieldName') {
            name = field[key]; 
          }
          if(key === 'fieldValue') {
            value = field[key];
          }
        })
        
        return(
            <View style={{marginBottom: 15}}>
              <FieldItem 
                itemIndex={index} 
                title={name} 
                itemValue={value} 
                onDelete={handleRemoveField} 
                onTextChange={handleInputChange} 
              />
            </View>);
        
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
    }, [navigation, updatedEntry]);

    return(
        <>
            {entry.hasImage != false || image != null ?
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

            {entryFields ?
              <FlatList 
                data={entryFields}
                renderItem={({item, index}) => (renderItem(item, index))}
                keyExtractor={(item, index) => index}
                ListHeaderComponent={
                    <Input 
                        label="Entry Name" 
                        onChangeText={ (text) => { setEntryName(text);}}
                    >{entryName}</Input>}
                ListFooterComponent={
                    <>
                        <AddButton handlePress={handleAddField}/>
                        <Button onPress={handleDelete} title={"Delete Entry"} />
                    </>
                }
                
              />
              : 
              <Text>hi</Text>
              }
            
        </>
    ); 
};

export default TeamEditScreen;