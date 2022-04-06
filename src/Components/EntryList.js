import React, { useState, useEffect,} from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { FAB, SearchBar } from 'react-native-elements';

import { getAuth} from 'firebase/auth';
import { getFirestore ,collection} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
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

const EntryList = ({ navigation }) => {
    const [values] = useCollectionData(collection(firestore, "Users", auth.currentUser.uid, "Entries"));
    const [searchVal, setSearchVal] = useState();
    const [searchData, setSearchData] = useState();

    const entryImage = null;

    const [entryModalVisibility, setEntryModalVisibility] = useState(false);
  

    const toggleEntryModal = () => {
      setEntryModalVisibility(!entryModalVisibility);
    };

    const handleEntryTap = (entry) => {
        navigation.navigate("Details", {entry});
    };

    const getImage = async (entryID) => {
        const imageRef = ref(storage, 'Users/' + auth.currentUser.uid + "/Images/" + entryID + ".jpg");
                
        const imageURI = getDownloadURL(imageRef)
        .then((url) => {
            return url;
        })
        .catch((error) => {
            console.log(error);
        });

        return imageURI;
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
            />
        );
    }
/*
    useEffect((searchVal) => {
        navigation.setOptions({
            
            header: (searchVal) => {
                return(
                    <View style={{paddingTop: 50, backgroundColor: "#" }}>
                     <SearchBar 
                    placeholder='Search' 
                    onChangeText={handleSearch} 
                    value={searchVal}
                    containerStyle={{borderBottomWidth: 0, borderTopWidth: 0}}
                    inputContainerStyle={{margin: 0, borderRadius: 30,}}
                     />
                    
                    </View>
                   
                );
            }
        });
    }, [navigation,searchVal]);
*/
    useEffect(() => {
        if (values) {
            setSearchData(values);
        }
    }, [values]);
    
    return (
        <>
        <FlatList 
            horizontal={false}
            ListHeaderComponent={ <SearchBar 
                placeholder='Search' 
                onChangeText={handleSearch} 
                value={searchVal}
                containerStyle={{borderBottomWidth: 0, borderTopWidth: 0}}
                inputContainerStyle={{margin: 0, borderRadius: 30,}}
                 />}
            numColumns={2}
            style={{paddingTop: 0, height: '100%', width: '100%'}}
            columnWrapperStyle={{justifyContent: "space-between", margin: 20}}
            data={searchData}
            renderItem={renderItem}
            keyExtractor={(item) => item.entry_ID}
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
        <AddEntryComponent fireAuth={auth} toggleModalVisibility={toggleEntryModal} modalVisibility={entryModalVisibility} />
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

export default EntryList;