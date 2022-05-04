import React, { useState, useEffect,} from 'react';
import { StyleSheet, FlatList, View, Alert, } from 'react-native';
import { FAB, SearchBar, Button, Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

import { getAuth} from 'firebase/auth';
import { getFirestore ,collection, doc, setDoc, updateDoc, } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import { getApp } from 'firebase/app';
import EntryButton from './EntryButton.js';
import {AddEntryComponent} from '../componentIndex.js';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import filter from 'lodash.filter';

const app = getApp();
const storage = getStorage();
const firestore = getFirestore(app); 

const auth = getAuth();
//const storage = getStorage();

const TeamEntryList = ({ route, navigation }) => {
    const { teamID } = route.params;
    const [values] = useCollectionData(collection(firestore, "Teams", teamID, "Entries"));
    const [searchVal, setSearchVal] = useState();
    const [searchData, setSearchData] = useState();
    const [collapsed, setCollapsed] = useState(true);


    const entryImage = null;

    const [entryModalVisibility, setEntryModalVisibility] = useState(false);
  

    const toggleCollapsible = () => {
        setCollapsed(!collapsed);
    }

    const closeCollapsible = () => {
        if (collapsed != true) {
            setCollapsed(true);
        }
    }
    const toggleEntryModal = () => {
      setEntryModalVisibility(!entryModalVisibility);
    };

    const handleEntryTap = (entry) => {
        navigation.navigate("Details", {entry, teamID});
    };

    const getImage = async (entryID) => {
        const imageRef = ref(storage, 'Teams/' + teamID + "/Entries/" + entryID + ".jpeg");
               
        const image = getDownloadURL(imageRef)
        .then((url) => {
            console.log(url)
            return url;
        })
        .catch((error) => {
            console.log(error);
        });

        return image;
    };
 
    /* This code came in clutch from stackoverflow. 
    Basically it converts the raw base64 data to a format that firebase accepts */
    const urltoFile = async (url, filename, mimeType) => {
        return (fetch(url)
            .then((response) => {
                return response.blob();
                
            })
            .then((buffer) => {
                return new File([buffer], filename, {type:mimeType});
            })
        );
    }

    const uploadImage = async (docID, image) => {
        const storageRef = ref(storage, 'Teams/' + teamID + "/Entries/" + docID + ".jpeg")
    
        urltoFile(`data:${image.mime};base64,${image.data}`, docID + ".jpeg", image.mime )
        .then((image) => {
            uploadBytes(storageRef, image)
            .then(async () => {
                await getDownloadURL(storageRef)
                .then((value) => {
                    console.log(value)
                    const docRef = doc(firestore, "Teams", teamID, "Entries", docID);
                    updateDoc(docRef, {
                        "image": value,
                        "hasImage": true
                    })
                })

            })
        })
        .catch((error) => {"something" + console.log(error)})
        
      }

    const createDocument = async (entry, image) => {
    
        const newDocRef = doc(collection(firestore, "Teams", teamID, "Entries"));
        entry.entry_ID = newDocRef.id;
        await setDoc(newDocRef, entry)
          .then((reference, data) => {
            //console.log(reference);
            //console.log(data);
            
          })
          .catch((error) => {
            console.log("Something 2" + error)
          });
        
          if (image) {
            
            uploadImage(newDocRef.id, image);
        }
        
      };

    const handleSearch = (search) => {
        const query = search.toLowerCase()
        const data = filter(values, entry => {
            return contains(entry, query);
        })

        setSearchData(data);
        setSearchVal(search);
    }

    const contains = (entry, query) => {
        const {entry_name} = entry;
        if (entry_name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    }

    const renderItem = ({item}) => {

        
        return(
            <EntryButton 
                entry={item} 
                image={getImage}  
                handleButtonPress={handleEntryTap}
                teamID={teamID}
            />
        );
    }

 useEffect(() => {
      navigation.setOptions({
        headerRight: () => {
            return(
                <Button 
                   style={{marginRight: 5}}
                    icon={
                        <Icon 
                            name='search' 
                            type='ionicons'
                        />
                    } 
                    onPress={toggleCollapsible} 
                    type="clear"
                />
            );
        } 
      });
      
    }, [navigation, collapsed]);

    useEffect(() => {
        if (values) {
            setSearchData(values);
        }
    }, [values]);
    
    return (
        <>
        <Collapsible collapsed={collapsed}>
            <SearchBar 
                placeholder='Search' 
                onChangeText={handleSearch} 
                value={searchVal}
                containerStyle={{borderBottomWidth: 0, borderTopWidth: 0}}
                inputContainerStyle={{margin: 0, borderRadius: 30,}}
            />
        </Collapsible>
        <FlatList 
           
            horizontal={false}
            numColumns={2}
            style={{paddingTop: 0, height: '100%', width: '100%'}}
            columnWrapperStyle={{justifyContent: "space-between", margin: 20}}
            data={searchData}
            renderItem={renderItem}
            keyExtractor={(item) => item.entry_ID}
           // onTouchStart={closeCollapsible}
        />
        
        <FAB
            visible={true}
            icon={{
                name: 'add',
                color: 'gray',
            }}
            color={"white"}
            placement={'right'}
            size="large"
            style={{shadowColor: '#a2a2a2',
            shadowOffset: {width: 0, height: 3},
            shadowRadius: 2,
            shadowOpacity: 1, }}
            onPress={toggleEntryModal}
        />
        <AddEntryComponent fireAuth={auth} toggleModalVisibility={toggleEntryModal} modalVisibility={entryModalVisibility} createDocument={createDocument}/>
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
        shadowRadius: 2,
        shadowOpacity: 1, 
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
});

export default TeamEntryList;