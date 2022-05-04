import React, { useEffect, useState, useRef } from 'react';
import {View, StyleSheet, Text, Pressable, Image, Animated, Alert} from 'react-native';
import { VibrancyView } from '@react-native-community/blur';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const MemberButton = (props) => {
    //const [image, setImage] = useState();
    const scale = useRef(new Animated.Value(1)).current;
    const memberName = props.member.first_name + " " + props.member.last_name;
    const memberID = props.member.member_id
    const image = props.member.imageURL
    const viewEntry = () => {
        props.viewEntry(props.member)
    }

    /*
    useEffect(() => {
        if (props.entry.hasImage) {
            setImage(props.entry.cover_photo);
        }
    }, [image]);
*/
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
            <Animated.View style={{transform: [{scale: scale}], alignItems: "center"}}>
                    
                    <Pressable style={styles.buttonContainer} onPressIn={() => {resizeAnim(1.03)}} onPressOut={() => {resizeAnim(1);}} onPress={viewEntry}>
                        <Image style={styles.image} source={{uri: image}}/>
                    </Pressable>  
                    <View style={{marginTop: 5}}>
                        <Text style={{alignSelf:"center",fontSize: 16, fontWeight: "500"}}>{props.member.display_name}</Text>
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
        borderRadius: 100, 
        width: 125, 
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
        borderRadius: 100, 
        
        
    },
    

});
export default MemberButton;