import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, } from 'react-native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';

const ReadOnlyFieldItem = ({title, itemIndex, itemValue}) => {
    const [fieldValue, setFieldValue] = useState(itemValue);
    const [fieldValueLength, setFieldValueLength] = useState();

    useEffect(() => {
        const initialLength = "" + itemValue;
        setFieldValueLength(initialLength.length);
    } ,[]);


    return (
        <View style={{marginTop: 5, marginHorizontal: 15, backgroundColor:"#F9F9F9", borderRadius: 10,  shadowColor: '#bdbdbd',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.8, }}>
            <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 15, flexDirection: "row", justifyContent:"space-between", alignContent: "center", paddingBottom: 5, paddingTop: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, shadowColor: '#bdbdbd',
                shadowOffset: {width: 0, height: 4},
                shadowRadius: 5,
                shadowOpacity: 0.8, }}>
                <Text 
                    style={{fontSize: 22, fontWeight: "700", marginTop: 10, opacity: 0.8}} 
                    maxLength={25} 
                    placeholder='Information Title'
                >{title}</Text>
                
                
                
            </View>
            
            <View style={{paddingHorizontal: 15, paddingBottom: 5, paddingTop: 5, flexDirection:"row", opacity: 1, borderBottomLeftRadius: 10, borderBottomRightRadius:10}}>
                <View style={{flex: 1, marginRight: 5}}>
                <Text style={{fontSize: 14, fontWeight:"500"}} placeholder='Value' maxLength={50} multiline={true}>{fieldValue}</Text>
                </View>
                
            </View>
            
        </View>
    );
};

export default ReadOnlyFieldItem;