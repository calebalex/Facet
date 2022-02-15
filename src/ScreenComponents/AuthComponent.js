import React, { useState } from 'react';
import {View, } from 'react-native';
import {Input, Button} from 'react-native-elements';

const AuthComponent = (props) => {
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();

  const runMethod = () => {
    props.givenMethod(email, pass);
  };

  return (
    <View style={{alignContent: "center"}}>
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
  

export default AuthComponent;