import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, } from 'react-native';
import { BlurView } from '@react-native-community/blur';

const ImageButton = (props) => {
  /*
    return(
       
            <View style={styles.container} >
                <View style={{width: '100%', height: 300, flexDirection: "column",}}>
                    <Image style={{width: '100%', height: 250, tintColor: "#b0e000", opacity: 0.5}} borderTopLeftRadius={15} borderTopRightRadius={15} blurRadius={30} source={require("./TestImages/Sunrise978x475.png")}/>
                    <View style={{justifyContent: "center", borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: 15, bottom:0, position: "absolute", alignSelf:"auto", backgroundColor:"#FFFFFF", width: "100%", height: 50,}}>
                        <Text style={{alignSelf: "center", color: "#000", fontWeight: "800", fontSize: 24}}>Saw</Text>
                    </View>
                    
                </View>
               
                    
                
            
            </View>
    );
    */
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 0,
        alignSelf: "center", 
        justifyContent: "center",
        alignContent: "center",
        shadowColor: '#bdbdbd',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.5, 
        marginVertical: 10, 
        padding: 0,
        width: '100%',
    },
    buttonContainer: {
        borderWidth:0,
        backgroundColor: "#FFFFFF",
        borderRadius: 15, 
        width: '100%', 
        height: 125, 
        justifyContent: "flex-start", 
        flexDirection: "row",
    },
    image: {
        resizeMode: "cover", 
        alignSelf: "flex-start", 
        height: '100%',
        width: 125,
        borderTopLeftRadius: 15, 
        borderBottomLeftRadius: 15,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
});

export default ImageButton;