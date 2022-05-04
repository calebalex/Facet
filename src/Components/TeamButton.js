import React, { useEffect, useState, useRef } from 'react';
import {View, StyleSheet, Text, Pressable, Image, Animated} from 'react-native';
import { VibrancyView } from '@react-native-community/blur';


const TeamButton = ({team, image, handleButtonPress}) => {
    const [imageState, setImageState] = useState();
    const scale = useRef(new Animated.Value(1)).current;

    const viewEntry = () => {
        handleButtonPress(team);
    };

    useEffect(() => {
        if (team.hasImage) {
            setImageState(team.cover_photo);
        }
    }, [imageState]);

    const resizeAnim = async (scaleToExpand) => {
            Animated.spring(scale, {
                toValue: scaleToExpand,
                duration: 0.1,
                useNativeDriver: false,
            }).start();
        
    };

    const handleAnim = () => {
        console.log("Anim");
        resizeAnim(220)
    }

    return(
       <View  style={styles.container}>
            <Animated.View style={{transform: [{scale: scale}]}}>
                    <Pressable style={styles.buttonContainer} onPressIn={() => {resizeAnim(1.03)}} onPressOut={() => {resizeAnim(1);}} onPress={viewEntry}>
                        <Image style={styles.image} source={{uri: team.team_image}}/>
                    </Pressable>  
                    <View style={styles.text}>
                        <Text style={{alignSelf:"center",fontSize: 16, fontWeight: "500"}}>{team.team_name}</Text>
                    </View> 
            </Animated.View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 0,
        alignSelf: "center", 
        justifyContent: "center",
        shadowColor: '#bdbdbd',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.5, 
        marginVertical: 0, 
        padding: 0,
        width: '45%',
    },
    buttonContainer: {
        borderWidth:0,
        backgroundColor: "#FFFFFF",
        borderRadius: 15, 
        width: '100%', 
        height: 125, 
        justifyContent: "flex-end", 
        flexDirection: "column",
        alignContent: "center"
    },
    image: {
        resizeMode: "cover", 
        alignSelf: "flex-start", 
        height: '100%',
        width: '100%',
        borderRadius: 15, 
        borderRadius: 15,
        
    },
    

});
export default TeamButton;