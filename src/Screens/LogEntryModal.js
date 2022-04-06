import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, TextInput, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';

import DatePicker from 'react-native-date-picker';


const LogEntryModal = (props) => {
    const [date, setDate] = useState(new Date());
    const [dateText, setDateText] = useState(date.toLocaleDateString());
    const [logText, setLogText] = useState("");
    const [charLength, setCharLength] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
  
    const handleDateText = (date) => {
      
      setDateText(date.toLocaleDateString());
    };
  
    const handleCharLength = (text) => {
      
      setCharLength(text.length);
      
    }
  
    const handleModal = (bool, date) => {
      setModalOpen(bool);
      if (date != null) {
        handleDateText(date);
        setDate(date);
      }  
    }
  
    const handleUpdate = () => {
        
        if(props.hasEntry ===true) {
          const newLog = {id: props.entry.id, date: date, logText: logText};
          props.updateLog(newLog);
        } 
        else {
          const newLog = {date: date, logText: logText};
          props.addLog(newLog);
        }
        
    }
  
    useEffect(() => {
      
      if(props.hasEntry === true) {
        const entryDate = new Date(props.entry.date["seconds"] * 1000);
        setDate(entryDate);
        setDateText(entryDate.toLocaleDateString());
        setLogText(props.entry.logText);
        handleCharLength(props.entry.logText);
      }
    
      
  }, []);
  
    return(
        <>
        <View style={{backgroundColor: "#f2f2f2", flex:1}}>
            <View style={{flexDirection:'row', justifyContent:"space-between", alignItems:"center", width: '100%', backgroundColor: "#FFFFFF", borderBottomColor: "#ababab", borderBottomWidth: 0.15}}>
                <Button 
                    style={{ marginHorizontal: 10, marginVertical: 6, marginLeft: 10}} 
                    icon={
                        <Icon 
                            name='chevron-left' 
                            type='font-awesome'
                        />
                    } 
                    onPress={props.toggleLogModal} 
                    type="clear"
                />
                <Text style={{fontSize: 18, fontWeight: "600"}}>{props.hasEntry ? "Edit Service Log": "Add Service Log"}</Text>
                <Button 
                    style={{marginHorizontal: 10, marginVertical: 6, marginLeft: 10}} 
                    icon={
                        <Icon 
                            name='check' 
                            type='font-awesome'
                        />
                    } 
                    onPress={handleUpdate} 
                    type="clear"
                />
            </View>
        

            <View style={{margin: 10}}>
                <TouchableOpacity style={{borderRadius: 15, alignSelf: "center", alignItems: "center", backgroundColor:"#FFFFFF", shadowColor: '#bdbdbd',
        shadowOffset: {width: 0, height: 5},
        shadowRadius: 5,
        shadowOpacity: 1, }} onPress={() => {handleModal(true)}}>
                <Text style={{margin: 10, fontSize: 18, fontWeight: "500"}}>{dateText}</Text>
                </TouchableOpacity>
                
                <DatePicker 
                modal
                open={modalOpen}
                date={date}
                onConfirm={(date) => {
                    handleModal(false, date)
                }}
                onCancel={() => {
                    handleModal(false)
                }}
                mode="date"
                />
                <View style={{borderRadius: 15, marginVertical: 10, backgroundColor: "#FFFFFF", shadowColor: '#bdbdbd',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 1, }}>
                <TextInput 
                    onChangeText={(text) => {
                    setLogText(text)
                    handleCharLength(text);
                    }} 
                    maxLength={500} 
                    multiline={true}
                    
                    placeholder="Enter Details"
                    style={{margin: 10, fontWeight: "800", fontSize: 18}}
                >{logText}</TextInput>
        
                <Text style={{margin: 10, marginTop: 20, alignSelf: "flex-end", opacity: 0.4}}>{charLength}/500</Text>
                </View>
            </View>
        </View>
      </>
    );
  }

  export default LogEntryModal;