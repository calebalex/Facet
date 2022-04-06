import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, } from 'react-native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';

const FieldItem = ({title, itemIndex, itemValue, onDelete, onTextChange}) => {
    const [fieldValue, setFieldValue] = useState(itemValue);
    const [fieldValueLength, setFieldValueLength] = useState();

    useEffect(() => {
        
        const initialLength = "" + itemValue;
        setFieldValueLength(initialLength.length);
    } ,[]);

    const handleFieldValue = (text) => {
        setFieldValue(text);
        setFieldValueLength(text.length);
        onTextChange(itemIndex, text, "fieldValue");
    }

    const deleteItem = () => {
        onDelete(itemIndex);
    }

    return (
        <View style={{marginTop: 5, marginHorizontal: 15, backgroundColor:"#F9F9F9", borderRadius: 10,  shadowColor: '#bdbdbd',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.8, }}>
            <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 15, flexDirection: "row", justifyContent:"space-between", alignContent: "center", paddingBottom: 5, paddingTop: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, shadowColor: '#bdbdbd',
                shadowOffset: {width: 0, height: 4},
                shadowRadius: 5,
                shadowOpacity: 0.8, }}>
                <TextInput 
                style={{fontSize: 22, fontWeight: "700", marginTop: 10, opacity: 0.8}} maxLength={25} placeholder='Information Title'
                onChangeText={(value) => {onTextChange(itemIndex, value, "fieldName")}}
                >{title}</TextInput>
                
                <Button buttonStyle={{padding: 0,}}
                
                icon={
                    <Icon 
                        name='times' 
                        type='font-awesome-5'
                        size={30}
                    />
                } 
                type="clear"
                onPress={deleteItem}
                />
                
            </View>
            
            <View style={{paddingHorizontal: 15, paddingBottom: 5, paddingTop: 5, flexDirection:"row", opacity: 1, borderBottomLeftRadius: 10, borderBottomRightRadius:10}}>
                <View style={{flex: 1, marginRight: 5}}>
                <TextInput style={{fontSize: 14, fontWeight:"500"}} placeholder='Value' onChangeText={handleFieldValue} maxLength={50} multiline={true}>{fieldValue}</TextInput>
                </View>
                <Text style={{alignSelf:"flex-end", opacity: 0.5, fontSize: 14, fontWeight:"500"}}>{fieldValueLength}/50</Text>
            </View>
            
        </View>
    );
};

export default FieldItem;