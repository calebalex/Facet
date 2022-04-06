import React, { useState, useEffect,} from 'react';
import { FlatList, View } from 'react-native';
import { Icon, Button} from 'react-native-elements';
import { Input } from 'react-native-elements';

import { FieldItem, AddButton} from '../componentIndex';
import {doc, deleteDoc, updateDoc, getFirestore,} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firestore = getFirestore();
const auth = getAuth();

const EditScreen = ({route, navigation}) => {
    const entry = route.params.entry
    const [entryName, setEntryName] = useState(entry.entry_name);
    const [entryFields, setEntryFields] = useState(entry.entry_fields);
    const entryID = entry.entry_ID;

    const updatedEntry = {
        entry_ID: entryID,
        entry_name: entryName,
        entry_fields: entryFields,
    };

    const handleGoBack = () => {
        navigation.goBack();
    }

    const handleUpdate = () => {
        const docRef = doc(firestore, "Users", auth.currentUser.uid, "Entries", entryID);

        if (JSON.stringify(entry) != JSON.stringify(updatedEntry)) {
            updateDoc(docRef, updatedEntry)
            .then(() => {
                navigation.navigate(route.params.previousScreen, {entry: updatedEntry});
            })
            .catch((error) => {
                console.log(error);
            });
        }
        else {
            console.log("Not updated");
            handleGoBack();
        }
    };

    const handleDelete = () => {
        const docRef = doc(firestore,"Users", auth.currentUser.uid, "Entries", entry.entry_ID);
        
        deleteDoc(docRef)
        .then(() => {
        navigation.navigate("Entries");
        })
        .catch((error) => {
        console.log(error);
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

export default EditScreen;