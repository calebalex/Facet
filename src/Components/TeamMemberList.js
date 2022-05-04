import React, { useState, useEffect,} from 'react';
import { StyleSheet, FlatList, View, Alert} from 'react-native';
import { FAB, SearchBar, Button, Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

import { getAuth} from 'firebase/auth';
import { getFirestore ,collection, setDoc, doc, updateDoc, arrayUnion, deleteDoc, arrayRemove} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { getApp } from 'firebase/app';
import EntryButton from './EntryButton.js';
import {AddEntryComponent, MemberButton} from '../componentIndex.js';
import { useCollectionData,  } from 'react-firebase-hooks/firestore';
import filter from 'lodash.filter';


const app = getApp();
const storage = getStorage();
const firestore = getFirestore(app); 

const auth = getAuth();
//const storage = getStorage();

const TeamMemberList = ({ route, navigation }) => {
    const { teamID } = route.params;
    const [values] = useCollectionData(collection(firestore, "Teams", teamID, "Members"));
    const [searchVal, setSearchVal] = useState();
    const [searchData, setSearchData] = useState();
    const [collapsed, setCollapsed] = useState(true);
    const [userAdminStatus, setUserAdminStatus] = useState();

    const updateTeamAdmin = (memberID, promotionValue) => {
        return new Promise((resolve, reject) => {   
            const docRef = doc(firestore, "Teams", teamID, "Members", memberID);
            updateDoc(docRef, {
                admin: promotionValue
            })
            .then(resolve(memberID))
            .catch((error) => reject(error))
        })
    }


    const kickTeamMember = (memberID) => {
        return new Promise((resolve, reject) => {   
            const docRef = doc(firestore, "Teams", teamID, "Members", memberID);
            deleteDoc(docRef);
            const teamDocRef = doc(firestore, "Teams", teamID,);
            updateDoc(teamDocRef, {
                Members: arrayRemove(memberID)
            })
            .then(resolve(memberID))
            .catch((error) => reject(error))
        })
    }

    const alertUser = (message) => {
        Alert.alert(message, null, [{
            text: "Ok",
            style: "default"
        }])
    }


    const promoteUser = async (memberID, promotionValue) => {
        let promotionText = null;
        if (promotionValue) {
            promotionText = "promote";
        } else {
            promotionText = "demote"
        }
        if (memberID != auth.currentUser.uid) {
            await updateTeamAdmin(memberID, promotionValue)
            .then((member) => {
                alertUser("Member " + member + " has been " + promotionText + "d")
            })
            .catch((error) => {
                alertUser(error)
            })
        } else {
            alertUser("You cannot " + promotionText+ " yourself")
        }
       
    }

    const kickUser = async (memberID) => {
        if (memberID != auth.currentUser.uid) {
            await kickTeamMember(memberID)
            .then((member) => {
                alertUser("Member " + member + " has been kicked")
            })
            .catch((error) => {
                alertUser(error)
            })
        } else {
            alertUser("You cannot kick yourself")
        }
    }

    const viewEntry = (member) => {
        if (userAdminStatus) {
            const admin = member.admin;
            let promotionText = null;
            if (admin) {
                promotionText = "Demote"
            } else {
                promotionText = "Promote"
            }
           
            Alert.alert(member.display_name, null, [
                {
                    text: promotionText,
                    onPress: () => {promoteUser(member.member_id, !admin)},
                    style: "default"
                },
                {
                    text: "Kick User",
                    onPress: () => {kickUser(member.member_id)},
                    style: "destructive"
                },
                {
                text: "Cancel",
                style:"cancel"
                },
            
            ])
        } else {
            Alert.alert("You are not an admin", null, [{
                text: "Ok",
                style: "default"
            }])
        }
        
    };

    const toggleCollapsible = () => {
        setCollapsed(!collapsed);
    }

    const closeCollapsible = () => {
        if (collapsed != true) {
            setCollapsed(true);
        }
    }
   
    const handleSearch = (search) => {
        const query = search.toLowerCase()
        const data = filter(values, entry => {
            return contains(entry, query);
        })

        setSearchData(data);
        setSearchVal(search);
    }

    const contains = (entry, query) => {
        const {display_name} = entry;
        if (display_name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    }

    const renderItem = ({item}) => {
        if (item.member_id == auth.currentUser.uid) {
            setUserAdminStatus(item.admin)
        }
        return(
            <MemberButton 
                member={item} 
                viewEntry={viewEntry}
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
            keyExtractor={(item, index) => index}
           // onTouchStart={closeCollapsible}
        />
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

export default TeamMemberList;