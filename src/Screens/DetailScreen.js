import React, { useEffect, useState } from 'react';
import {View, FlatList} from 'react-native';
import {Button, Input} from 'react-native-elements';
import { AddButton, FieldItem, ReadOnlyFieldItem } from '../componentIndex';


const DetailScreen = ({route, navigation}) => {
    const entry = route.params.entry;
    const entryFields = entry["entry_fields"];
    const entryName = route.params.entry.entry_name;
  
    const handleEdit = () => {
      navigation.push("Edit", {previousScreen: route.name , entry: entry});
    };
  
    const handleLogButton = () => {
      navigation.push("Service Logs", {entry: entry});
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
    }, [navigation, entry]);
  
    return(
      <View style={{paddingHorizontal: 10, flex: 1}}>
        

        {entryFields ?
          <FlatList 
            data={entryFields}
            renderItem={({item, index}) => (renderItem(item, index))}
            keyExtractor={(item, index) => index}
            ListHeaderComponent={<Input editable={false}>{entryName}</Input>}
            ListFooterComponent={<Button title={"View Service Log"} onPress={handleLogButton} />}
          />
          : 
          <Text>hi</Text>
        }

        
      </View>
    );
  };

  export default DetailScreen;