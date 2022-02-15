import React, { useState, useEffect } from 'react';
import { getApp, } from 'firebase/app';
import { collection, getFirestore, query, getDocs, } from 'firebase/firestore';
import { getAuth, } from 'firebase/auth';

import {
  Text,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';

import { EntryList } from '../componentIndex.js';
import data from '../../Data.js';

const app = getApp();
const auth = getAuth();
const firestore = getFirestore(app);

const EntriesScreen = () => {
  const [entryData, setEntryData] = useState([]);
  
  const getEntries = async () => {
    let entries = []
    const collectionRef = collection(firestore, "Users", auth.currentUser.uid, "Entries")
    const q = query(collectionRef);
    const querySnapshot = await getDocs(collectionRef);
    //console.log(querySnapshot);

    //console.log(entryData);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      entries.push(doc.data());
    });

    setEntryData(entries);
   // console.log(entryData);
  };

  useEffect(() => {
    getEntries()
    .catch((error) => {
      console.log(error);
    });
    /*
    setEntryData(data);
    entryData.forEach((data) => {
      console.log(data);
    });
    */
  }, []);


  const get = async () => {
    getEntries()
    
  };
  return(
    /*
    <>
      <Button title="get data" onPress={get} />
      <Text>{"" + data}</Text>
    </>
    */
   entryData != null ? <EntryList data={entryData} /> : <Text>Hi</Text>
  );
};

export default EntriesScreen;