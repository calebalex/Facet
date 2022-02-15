import React, { useState } from 'react';
import {View, Text, ScrollView, RefreshControl, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';
import { Card } from 'react-native-elements/dist/card/Card';
import EntryButton from './EntryButton.js';

const EntryList = (props) => {
    const data = props.data;

    return (
        <View>
            {data.map((entry) => {
                console.log(entry.entry_ID);
               return(<Text key={entry.entry_ID}>{entry.tool_name}</Text>);

             })} 
             <ScrollView style={{padding: 20}} contentContainerStyle={{alignContent: "center"}}>
                <Card containerStyle={{borderRadius: 15, height: 100, width: 325, alignSelf: "center", backgroundColor: "#FFFFFF", borderWidth: 0, shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 3,
    shadowOpacity: 0.2,
    justifyContent: "center", margin: 5}}>
                    <Text style={{alignSelf: "center"}}>Text</Text>
                </Card>
                <EntryButton />

             </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainerStyle: {
        borderRadius: 0,
        justifyContent: "center",
        alignSelf: "center", 
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 3,
        shadowOpacity: 0.2, 
        marginVertical: 15, 
        padding: 5
    },
    buttonStyle: {
        borderRadius: 15,
        height: 125,
        width: 350,
        backgroundColor: "#FFFFFF",
        borderWidth: 0,
    },
});

export default EntryList;