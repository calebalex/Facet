import React, { useState } from 'react';
import {Modal, View, StyleSheet, Text} from 'react-native';
import{Button, Divider} from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginComponent, RegisterComponent, } from '../componentIndex.js';

import { getAuth, } from 'firebase/auth';
import { Icon } from 'react-native-elements/dist/icons/Icon';

const auth = getAuth();

const LandingScreen = () => {

  const [registerModalVisibile, setRegisterVisibility] = useState(false);

  return(
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <LoginComponent 
          fireAuth={auth}
          customStyles={
            {inputContainer: styles.inputContainer, 
            innerInputContainer: styles.innerInputContainer,
            buttonContainer: styles.buttonContainer,
            innerButtonContainer: styles.innerButtonContainer,}}
        />
        <Divider style={{margin: 10, marginHorizontal: 25}} width={2}/>
        <Button 
          title="Create Account" 
          type="outline" 
          containerStyle={styles.buttonContainer} 
          buttonStyle={styles.innerButtonContainer} 
          titleStyle={{color: "#000"}} 
          onPress={() =>{setRegisterVisibility(!registerModalVisibile)}}
        />
    
        <Modal animationType="slide" visible={registerModalVisibile} presentationStyle={'pageSheet'}>
          <Button style={{alignSelf: "flex-start", margin: 10, marginTop: 15, marginLeft: 10}} icon={<Icon name='chevron-left' type='font-awesome'/>} onPress={() =>(setRegisterVisibility(!registerModalVisibile))} type="clear"/>
          <RegisterComponent 
            fireAuth={auth}
            customStyles={
              {inputContainer: styles.inputContainer, 
              innerInputContainer: styles.innerInputContainer,
              buttonContainer: styles.buttonContainer,
              innerButtonContainer: styles.innerButtonContainer,}}
          />
        </Modal>
      </View>
    </SafeAreaView>
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
    borderRadius: 30,
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
    padding: 15, 
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },

  innerButtonContainer: {
    alignSelf: 'center',
    width: 200,
    borderRadius: 30,
    borderWidth: 0,
    backgroundColor:"#FFFFFF",
  },

  view: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 0.75,
    alignContent: 'center',
    justifyContent: 'center'
  },
});
export default LandingScreen;