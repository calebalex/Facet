import React, {useEffect, useState} from 'react';
import {StyleSheet, Modal,} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { LogEntryComponent, AddButton } from '../componentIndex';
import { LogEntryModal } from '../screenIndex';

import { getApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, setDoc, deleteDoc} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from 'firebase/auth';
const app = getApp();
const firestore = getFirestore(app);
const auth = getAuth();

const logEntryData = {
    id: 0,
    date: "2022-09-09T00:39:10.000Z",
    logText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
};
const logEntryData2 = {
    id: 1,
    date: "2022-09-09T00:39:10.000Z",
    logText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

};

//const logs = [logEntryData, logEntryData2];

const LogScreen = ({navigation, route}) => {
    const [logs] = useCollectionData(collection(firestore, "Users", auth.currentUser.uid, "Entries", route.params.entry.entry_ID, "Service-Records"));
    

    const [data, setData] = useState(logs);

    const [selectedLog, setSelectedLog] = useState();
    
    let selectedLogIndex = null;
    const [hasEntry, setHasEntry] = useState(false);
    const [logModalVisibility, setLogModalVisibility] = useState(false);

    const toggleLogModal = () => {
        setLogModalVisibility(!logModalVisibility);
    };

    const [refresh, setRefresh] = useState(false);

    const findLogEntry = (element, newLog) => {
        if(element.id === newLog.id) {
            console.log("found")
            return true
           
        }
        else {
            console.log("not found")
            return false;
            
        }
    }

    const handleEditManageEntry = (log) => {
        //navigation.push("Log", {hasEntry: true, entry: log});
        setRefresh(true);
        setHasEntry(true);
        setSelectedLog(log);
        toggleLogModal();
    };

    const handleAddFirestore = async() => {

    }

    const handleAddLogEntry = () => {

        toggleLogModal();
        
    }

    const updateLog = (updatedLog) => {
        console.log(updatedLog);
        //const index = logs.findIndex(element => element.id === newLog.id);
        //setData[selectedLogIndex] = newLog;
        const docRef = doc(firestore, "Users", auth.currentUser.uid, "Entries", route.params.entry.entry_ID, "Service-Records", updatedLog.id);

        if (JSON.stringify(selectedLog) != JSON.stringify(updatedLog)) {
            updateDoc(docRef, updatedLog)
            .then(() => {
                toggleLogModal();
                setSelectedLog(null);
                setHasEntry(false);
                setRefresh(true);
            })
            .catch((error) => {
                console.log(error);
            });
        }
        else {
            console.log("Not updated");
            toggleLogModal();
            setSelectedLog(null);
            setHasEntry(false);
            setRefresh(true);
            
        }
        
    };

    const addLog = (newLog) => {
        const newDocRef = doc(collection(firestore, "Users", auth.currentUser.uid, "Entries", route.params.entry.entry_ID, "Service-Records"));
        
        newLog.id = newDocRef.id;
        setDoc(newDocRef, newLog)
        .then(() => {
            toggleLogModal();
            setSelectedLog(null);
            setHasEntry(false);
            setRefresh(true);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const deleteLog = (log) => {
        const docRef = doc(firestore, "Users", auth.currentUser.uid, "Entries", route.params.entry.entry_ID, "Service-Records", log.id)
        deleteDoc(docRef).catch((error) => {console.log(error)});
    }

    const closeModal = () => {
        toggleLogModal();
        setSelectedLog(null);
        setHasEntry(false);
        setRefresh(true);
    }

    useEffect(() => {
        setRefresh(false);
    },[refresh]);

    const renderLog = ({ item }) => {
        //console.log(item);
        return(
            <LogEntryComponent log={item} deleteLog={deleteLog} manageLog={handleEditManageEntry}/>
        );
    };

    return (
        <>

        

        {logs && (
            <FlatList data={logs} renderItem={renderLog} keyExtractor={(log) => log.id} ListFooterComponent={<AddButton handlePress={handleAddLogEntry}/>}/>
        )}

        

        <Modal  animationType="slide" visible={logModalVisibility} presentationStyle={'pageSheet'}>
                
            <LogEntryModal addLog={addLog} updateLog={updateLog} toggleLogModal={closeModal} hasEntry={hasEntry} entry={selectedLog}/>
            
        </Modal>
       
        </>
        
    );
};

const styles = StyleSheet.create({
    
});

export default LogScreen;