import React, { useState, useEffect,} from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import { FAB, SearchBar, Button, Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

import { getAuth} from 'firebase/auth';
import { getFirestore ,collection, query, where, doc, QueryDocumentSnapshot, getDoc, getDocs, updateDoc, arrayUnion, setDoc} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { getApp } from 'firebase/app';
import {AddTeamComponent, TeamButton} from '../componentIndex.js';
import { useCollectionData, useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import filter from 'lodash.filter';

const app = getApp();
const storage = getStorage();
const firestore = getFirestore(app); 

const auth = getAuth();
//const storage = getStorage();

const TeamList = ({ navigation }) => {
    const [teams] = useCollectionData(query(collection(firestore, "Teams"), where("Members", "array-contains", auth.currentUser.uid)))
    
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
    const toggleTeamModal = () => {
      setEntryModalVisibility(!entryModalVisibility);
    };


    const handleEntryTap = (team) => {
        
        navigation.navigate("Team Page", {team: team, teamID: team.teamID});
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
        const data = filter(teams, entry => {
            return contains(entry, query);
        })

        setSearchData(data);
        setSearchVal(search);
    }

    const contains = (entry, query) => {
        const {team_name} = entry;
        if (team_name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    }

    const renderItem = ({item}) => {


        return(
            <TeamButton 
                team={item} 
                image={getImage}  
                handleButtonPress={handleEntryTap}
            />
        );
    }

    const updateTeam = async (team) => {
        await updateDoc(team.ref, {
            Members: arrayUnion(auth.currentUser.uid)
        })
       await setDoc(doc(firestore, "Teams", team.id, "Members", auth.currentUser.uid), {
            admin: false,
            display_name: auth.currentUser.displayName,
            member_id: auth.currentUser.uid,
            imageURL: auth.currentUser.photoURL, 
        })
    }

    const findUser = (id) => {
        return id == auth.currentUser.uid;
    }

    const joinTeam = async (name, passcode) => {
        let team = null;
        const teamQuery = query(collection(firestore, "Teams"), 
            where("team_name", "==", name), where("team_passcode", "==", passcode))
        await getDocs(teamQuery).then((snap) => {
            if (snap.size != 0) {
                snap.forEach((docSnap) => {
                    console.log(docSnap.data())
                    team = docSnap
                })
                if (team.data().Members.find(findUser)) {
                    Alert.alert("Already part of this team", null, [
                        {
                            text: "Ok",
                            style: "default"
                        }
                    ])
                }
                else {
                    updateTeam(team)
                    Alert.alert("Successfully Joined Team", null, [
                    {
                        text: "Ok",
                        style: "default"
                    }
                ])
                }
                
            } 
            else {
                console.log("nothing")
                Alert.alert("No Team Found", null, [
                    {
                        text: "Ok",
                        style: "default"
                    }
                ])
            }
        })

    }

    const passcodeAlert = (teamName) => {
        Alert.prompt("Enter Team Passcode", "Team Name: " + teamName, [
            {
                text: "Join Team",
                onPress: (passcode) => {joinTeam(teamName, passcode)},
                style: "default"
              },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style:"cancel"
            },
          
        ])
    }

    const joinAlert = () => {
        Alert.prompt("Enter Team Name", null, [
            {
                text: "Next",
                onPress: (teamName) => {
                    if(teamName.trim().length != 0 ) {
                        passcodeAlert(teamName)
                    } else{
                        console.log("failed")
                    }
                },
                style: "default"
              },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style:"cancel"
            },
          
        ])
    }

    const onAdd = () => {
        Alert.alert("Add Team", null, [
            {
                text: "Join Team",
                onPress: joinAlert,
                style: "default"
              },
            {
                text: "Create Team",
                onPress: toggleTeamModal,
                style: "default"
              },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style:"cancel"
            },
          
        ])
    }

 useEffect(() => {
      navigation.setOptions({
        headerRight: () => {
            return(
                <View style={{flexDirection: "row",}}>
                    <Button 
                   style={{marginRight: 0}}
                   
                    icon={
                        <Icon 
                            name='search' 
                            type='ionicons'
                        />
                    } 
                    onPress={toggleCollapsible} 
                    type="clear"
                    />
                    <Button 
                   style={{marginRight: 5}}
                    icon={
                        <Icon 
                            name='plus-circle' 
                            type='feather'
                           
                        />
                    } 
                    onPress={onAdd} 
                    type="clear"
                    />
                    
                </View>
                
            );
        } 
      });
      
    }, [navigation, collapsed]);

    useEffect(() => {
        if (teams) {
            setSearchData(teams);
        }
    }, [teams]);
   
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
            keyExtractor={(item, index) => item.teamID}
           // onTouchStart={closeCollapsible}
        />
        
        <AddTeamComponent fireAuth={auth} toggleModalVisibility={toggleTeamModal} modalVisibility={entryModalVisibility} />
        
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

export default TeamList;