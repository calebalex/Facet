import React, { useState } from 'react';
import {Text, FlatList, View, StyleSheet, Modal} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import { FieldItem, AddButton } from '../componentIndex';
import Snackbar from 'rn-snackbar-component';

import { getApp } from 'firebase/app';
import {doc, setDoc, collection, getFirestore, } from "firebase/firestore";

const app = getApp();
const firestore = getFirestore(app);

const AddEntryComponent = ({fireAuth, modalVisibility, toggleModalVisibility}) => {
  const [entryFields, setEntryFields] = useState([]);
  const [entryName, setEntryName] = useState();
  

  const runMethod = async () => {
    const newDocRef = doc(collection(firestore, "Users", fireAuth.currentUser.uid, "Entries"));
    const entry = {
        entry_ID: newDocRef.id,
        entry_name: entryName,
        entry_fields: entryFields,
    };
    
    await setDoc(newDocRef, entry)
    .catch((error) => {
      console.log(error)
    });
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

  const handleAdd = () => {
    runMethod().catch((error) => {console.log(error)});
    toggleModalVisibility()
  }

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
                  onPress={toggleModalVisibility} 
                  type="clear"
              />
              <Text style={{fontSize: 18, fontWeight: "600"}}>Add Entry</Text>
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
      

          <View style={{margin: 10}}>
            <View style={{alignContent: "center"}}>
        
              {entryFields ?
              <FlatList 
                data={entryFields}
                renderItem={({item, index}) => (renderItem(item, index))}
                keyExtractor={(item, index) => index}
                ListHeaderComponent={<Input 
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.innerInputContainer}
                  placeholder='Entry Name' 
                  //leftIcon={{type: 'entypo', name: 'mail'}}
                  onChangeText={(text) => {
                    setEntryName(text);
                  }}
                />}
                ListFooterComponent={<AddButton handlePress={handleAddField}/>}
              />
              : 
              <Text>hi</Text>
              }
              </View>
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

export default AddEntryComponent;