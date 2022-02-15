import React, { useState } from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import { Button } from 'react-native-elements';



const EntryButton = (props) => {
    return(
        <>
            <TouchableOpacity style={styles.touchable} >
                <Text>HI</Text>
                <Image source={require("./TestImages/rose-165819__340.webp")}/>
            </TouchableOpacity>
            
        </>

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
    touchable: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        justifyContent: "center",
        alignSelf: "center", 
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 3,
        shadowOpacity: 0.2, 
        marginVertical: 15, 
        padding: 5,
        width: 350,
        height: 125
    }
});
export default EntryButton;