import React, { useEffect, useState, useRef} from 'react';
import {Animated, View, StyleSheet, Text, TouchableOpacity, Image, FlatList, ScrollView, Alert} from 'react-native';
import { Button } from 'react-native-elements';

const LogEntryComponent = ({log, manageLog, deleteLog}) => {
  
    const [expanded, setExpanded] = useState(false);
    const [buttonText, setButtonText] = useState("View More");

    const date = new Date(log.date["seconds"] * 1000);
    const dateText = date.toLocaleDateString();

    const END_HEIGHT = 400;
    const START_HEIGHT = 125;
    const END_LINES = 20;
    const START_LINES = 3;

    const resizeAnim = useRef(new Animated.Value(125)).current;
    const linesAnim = useRef(new Animated.Value(3)).current;

    const handleEdit = () => {
        manageLog(log);
    };

    const handleEllipses = () => {
        Alert.alert("Options",null,  
            [
                {
                  text: "Edit",
                  onPress: handleEdit
                },
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { 
                    text: "Delete", 
                    onPress: () => deleteLog(log),
                    style: 'destructive'
                }
            ]
        );
    };

    const resize = (heightToExpand, linesToExpand) => {
        Animated.parallel([
            Animated.spring(resizeAnim, {
                toValue: heightToExpand,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(linesAnim, {
               toValue: linesToExpand,
               duration: 200,
               useNativeDriver: false ,
            })
        ]).start();
        
    };
     
    const toggleExpansion = () => {
        if (expanded) {
            resize(START_HEIGHT, START_LINES);  
            setButtonText("View More");
        }
        else{
            resize(END_HEIGHT, END_LINES);
            setButtonText("View Less");
        }
        setExpanded(!expanded);
    };

    return (
        <View style={styles.container} >
            
            <Animated.View style={[styles.innerContainer, {height: resizeAnim} ]}>
                <View style={{width: '100%', height: '100%', opacity: 1}} borderRadius={10}>
                <View style={{position: "relative", height: '100%',  margin: 10, marginTop: 25}}>
                    
                    <Animated.Text style={{marginVertical: 0, fontWeight: "800", fontSize: 16,}} numberOfLines={linesAnim} ellipsizeMode="tail">{log.logText}</Animated.Text>
                    <View style={styles.buttonContainer}>
                        <Button style={{alignContent: "center",}}  title={buttonText} titleStyle={{fontSize: 16, fontWeight: "300", color: "#000"}} type="clear" onPress={toggleExpansion} />
                    </View>
                </View>
                </View>
            </Animated.View>

            <View style={{paddingHorizontal: 10, alignSelf:"center", position: "absolute", flexDirection:"row", width: '100%',top: 15}}>
                <Text style={{ fontWeight: "500", fontSize: 16,}}>{dateText}</Text>
                <Button 
                    icon={{
                        name: 'ellipsis-h',
                        type: 'font-awesome-5',
                        color: 'black'
                    }} 
                    containerStyle={{
                        position: "absolute", 
                        right: 0, 
                        alignSelf: "center"
                    }} 
                    type="clear"
                    onPress={handleEllipses}
                />
            </View>
        </View>

    );
};
  
const styles = StyleSheet.create({
    container: {
        borderWidth: 0,
        alignSelf: "center", 
        alignContent: "center",
        margin: 0, 
        padding: 10,
        width: '100%',
        shadowColor: '#bdbdbd',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 1, 
    },
    innerContainer: {
        width: '100%', 
        height: 125, 
        flexDirection: "column", 
        backgroundColor: "#FFFFFF", 
        borderRadius: 10
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 25,
        width: "100%"
    },
    image: {
        resizeMode: "cover", 
        alignSelf: "flex-start", 
        height: '100%',
        width: 125,
        borderTopLeftRadius: 10, 
        borderBottomLeftRadius: 10,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
});

export default LogEntryComponent;