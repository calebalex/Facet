import { doc, getFirestore, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import {View, FlatList, Text, Image} from 'react-native';
import {Button, Input} from 'react-native-elements';
import { AddButton, FieldItem, ReadOnlyFieldItem } from '../componentIndex';

const firestore = getFirestore();

const TeamDetailScreen = ({route, navigation}) => {
    const {teamID, entry} = route.params;
    const [entryFields, setEntryFields] = useState();
    //const [entryName, setEntryName] = useState();
    const [entryData] = useDocumentData(doc(firestore, "Teams", teamID, "Entries", entry.entry_ID))
    
    const handleEdit = () => {
      navigation.push("Edit", {previousScreen: route.name , entry: entryData, teamID: teamID});
    };
  
    const handleLogButton = () => {
      navigation.push("Service Logs", {entry: entry, teamID: teamID});
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
        <ReadOnlyFieldItem 
          itemIndex={index} 
          title={name} 
          itemValue={value} 
        />
      </View>);
      
    };

    useEffect(() => {
      navigation.setOptions({
        headerRight: () => {
          return(
            <Button 
              title={"Edit"}
              type={"clear"}
              containerStyle={{marginHorizontal: 15}}
              onPress={handleEdit} 
            />
          );
        } 
      });
      console.log(entryFields);
    }, [navigation, entryData]);
  
    return(
      <View style={{paddingHorizontal: 10, flex: 1}}>
        {entryData != null  && entryData.image != null ?
        <>
            <View style={{flexDirection: "row", justifyContent: "center", marginVertical: 10}} >
              <View style={{alignSelf:"center", width: 200, height: 150, borderWidth: 8, borderRadius: 10, borderColor: "#FFFFFF", alignContent: "center", shadowColor: '#000',
shadowOffset: {width: 0, height: 2},
shadowRadius: 5,
shadowOpacity: 0.2,}}>
                <Image style={{width: "100%", height: "100%",}} source={{uri: entryData.image}} />
              </View>
              
            </View>
            
          </>
        :
        console.log("no image")
        }
        {entryData ?
        
          <FlatList 
            data={entryData.entry_fields}
            renderItem={({item, index}) => (renderItem(item, index))}
            keyExtractor={(item, index) => index}
            ListHeaderComponent={<Input label={"Entry Name"} editable={false}>{entryData.entry_name}</Input>}
            ListFooterComponent={<Button title={"View Service Log"} onPress={handleLogButton} />}
          />
          :
          <Text>Hi</Text>
        }

        
      </View>
    );
  };

  export default TeamDetailScreen;