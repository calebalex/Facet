import React, { useEffect, useState } from 'react';

import { getAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';
import { getFirestore, } from "firebase/firestore";

import { TextInput, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Icon, Button} from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';

import {EditScreen, LogScreen, DetailScreen} from '../screenIndex.js';
import { EntryList, AddEntryComponent, } from '../componentIndex.js';


const Stack = createStackNavigator();
const auth = getAuth();

const app = getApp();
const firestore = getFirestore(app);

const EntriesScreen = () => {
 
  return(
    <>
      <Stack.Navigator>
        <Stack.Screen name="Entries" component={EntryList} 
          /*
          options={{
            
            headerStyle: { 
              shadowOffset: {width: 0, height: 5},
              shadowRadius: 10,
              shadowOpacity: 0.85, 
              shadowColor: "#bdbdbd"
            }, 
            
            headerRight: () => {
              return(
                <Button 
                  icon={<Icon name='add' type='ionicons' size={30}/>} 
                  buttonStyle={{backgroundColor: "#FFFFFF"}} 
                  containerStyle={{marginHorizontal: 15}}
                 />
              );
            },
          }}
          */
        />
        <Stack.Screen name="Details" component={DetailScreen} options={({route}) => ({title: route.params.entry.entry_name})}/>
        <Stack.Screen name="Edit" component={EditScreen} />
        <Stack.Screen name="Service Logs" component={LogScreen} />
      </Stack.Navigator> 
      
      
    </>
  );
};

export default EntriesScreen;