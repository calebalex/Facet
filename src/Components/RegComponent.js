import React, { useState } from 'react';
import {View, Alert, Image, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import ImageCropPicker from 'react-native-image-crop-picker';

import {PhotoButton  }from '../componentIndex.js';

const RegComponent = (props) => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [image, setImage] = useState();

  const runMethod = async () => {
    props.givenMethod(email, pass, firstName, lastName, image);
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
      setImage(image)
    })
  
  }

  return (
    <View style={{alignContent: "center"}}>
      {image != null ?
              <>
                <View style={{flexDirection: "row", justifyContent: "center", marginBottom: 10}} >
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

      <Input 
        placeholder='Email' 
        containerStyle={props.customStyles.inputContainer} 
        inputContainerStyle={props.customStyles.innerInputContainer} 
        leftIcon={{type: 'entypo', name: 'mail'}}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <Input 
        placeholder='First Name' 
        containerStyle={props.customStyles.inputContainer} 
        inputContainerStyle={props.customStyles.innerInputContainer} 
        onChangeText={(text) => {
          setFirstName(text);
        }}
      />
      <Input 
        placeholder='Last Name' 
        containerStyle={props.customStyles.inputContainer} 
        inputContainerStyle={props.customStyles.innerInputContainer} 
        onChangeText={(text) => {
          setLastName(text);
        }}
      />
      <Input 
        placeholder='Password' 
        containerStyle={props.customStyles.inputContainer} 
        inputContainerStyle={props.customStyles.innerInputContainer} 
        leftIcon={{type: 'entypo', name: 'lock',}}
        secureTextEntry={true} 
        onChangeText={(text) => {
          setPass(text);
        }}
      />
      
      <Button
        title={props.givenTitle} 
        type="solid" 
        containerStyle={props.customStyles.buttonContainer} 
        buttonStyle={props.customStyles.innerButtonContainer} 
        titleStyle={{color: "#000"}} 
        onPress={runMethod}
      />
    </View>
  );
};
  

export default RegComponent;