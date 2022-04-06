import React from 'react';
import {View, StyleSheet,} from 'react-native';
import { Button } from 'react-native-elements';

const AddButton = (props) => {
 
    return (
        <View style={styles.container} >
            
            
            <View style={{width: '90%', height: 75, backgroundColor: "#FFFFFF",justifyContent: 'center', alignSelf:"center",lalignContent: "center", opacity: 0.9,}} borderRadius={10}>
                        
                <Button 
                    icon={{
                        name: 'plus-circle',
                        type: 'feather',
                        color: 'black',
                        style: {opacity: 0.2},
                        size: 50,
                        
                    }} 
                    containerStyle={{
                        alignSelf: "center"
                    }} 
                    type="clear"
                    onPress={props.handlePress}
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

export default AddButton;