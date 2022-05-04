import React, { useEffect, useState } from 'react';
import {View, FlatList, Text, TouchableOpacity, Touchable, Pressable, Alert, Image, TextInput} from 'react-native';
import { Input} from 'react-native-elements';
import { AddButton, FieldItem, LoadingIndicator, ReadOnlyFieldItem } from '../componentIndex';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, query, getDoc, doc, collectionGroup, limit, deleteDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { useCollectionData, useDocumentData, } from 'react-firebase-hooks/firestore';
import { useDownloadURL } from 'react-firebase-hooks/storage';

import { Button } from 'react-native-elements';

const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();


const TeamScreen = ({route, navigation}) => {
    const team = route.params.team;
    const teamID = team.teamID;
    const teamName = team.team_name;

    const [team_members,loadingMembers] = useCollectionData(query(collection(firestore, "Teams", teamID, "Members"), limit(10)));
    const [team_entries,loadingEntries] = useCollectionData(query(collection(firestore, "Teams", teamID, "Entries"), limit(10)));

    /* the alert sent out by pressing the header button */
    const handleEllipses = () => {
      const alertButtons = [
        {
          text: "Leave Team",
          onPress: handleLeaveTeam,
          style:"destructive"
        },
        {
        text: "Cancel",
        style: "cancel"
        },

      ];
      if(team.Owner == auth.currentUser.uid) {
        alertButtons.splice(0, 1);
        alertButtons.push(
          {
            text: "Edit Team Information",
            onPress: handleEditInfo,
            style: "default"
          },
          {
            text: "Delete Team",
            onPress: handleDelete,
            style: "destructive"
          }
        );
        
      }
      Alert.alert("Team Options", null, alertButtons);
    }

    /* alerts the user when they click delete team */
    const handleDelete = () => {
      Alert.alert("Are you sure?", null, 
      [
        {
          text: "Yes",
          onPress: deleteTeam,
          style: "destructive"
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ])
    }

    /* Deletes the team document. However the team's reference still exists. 
    In order to delete everything associated with a team I would need to 
    use cloud functions(a functionallity only accessible by giving google my credit card) */
    const deleteTeam = async () => {
      await deleteDoc(doc(firestore, "Teams", teamID)).then(() => {
        navigation.navigate("Teams")
      })
    }

    /* alerts the user when they click edit team info */
    const handleEditInfo = () => {
      navigation.navigate("Edit Team", {previousScreen: route.name, team: team})
    }

    /* alerts the user when they click leave team */
    const handleLeaveTeam = async () => {
      const docRef = doc(firestore, "Teams", teamID, "Members", auth.currentUser.uid)
      const teamDocRef = doc(firestore, "Teams", teamID);
      await deleteDoc(docRef)
      .then(() => {
        updateDoc(teamDocRef, {
          Members: arrayRemove(auth.currentUser.uid)
        })
        .catch((error) => {console.log(error)})
        navigation.goBack();
      })
      .catch((error) => {console.log(error)})
    }

    /* navigates to the team's members page */
    const onViewMembers = () => {
      
      navigation.push("Team Members", {teamID: teamID})
      
    }

    /* navigates to the team's entries page */
    const onViewEntries = () => {
      console.log("View Entries")
      navigation.push("Team Entries", {teamID: teamID})
    }

    /* navigates to the details of an entry when they click on an entry from the team page */
    const onClickEntry = (entry) => {   
        console.log(entry.entry_name) 
        navigation.navigate("Details", {entry: entry, teamID: teamID});
    }

    /* handles displaying member components */
    const renderMember = (member, index) => {
      
      return(
        <View>
          <UserElement member={member}/>
        </View>
      );  
    };

    /* handles displaying entry components */
    const renderEntry = (entry, index) => {
        
      return(
        <Pressable onPress={() => { onClickEntry(entry) }}>
          <EntryElement entry={entry} />
        </Pressable>
      );  
    };

    /* sets the right part of the headers button. Refreshes every time the navigation changes*/
    useEffect(() => {
      
      navigation.setOptions({
        headerRight: () => {
          return(
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
          );
        }
      })
    }, [navigation]);

  
    return(
      <View style={{flex: 1}}>

        {/*Team Header*/} 
        <View style={{paddingHorizontal: 10, flexDirection: "row",  marginVertical: 10}}> 
          {team != null  && team.team_image != null ?        
            <View style={{
              shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowRadius: 5,
                  shadowOpacity: 0.2, 
                  } 
            }>
                  <Image 
                  style={{alignSelf:"center", 
                  width: 150, 
                  height: 150,  
                  borderRadius: 100}} 
                  source={{uri: team.team_image}} 
                  />
            </View>      
          :
          console.log("no image")
          }
          <View style={{marginLeft: 15, flexShrink: 1}}>
            <Text style={{fontSize: 25, fontWeight: "bold"}}>{teamName}</Text>
            
            <Text style={{fontSize: 12, marginBottom: 10}} multiline={true}>{team.team_description}</Text>
              
            
            <Text style={{fontSize: 14,}}>{"Team Passcode: " + team.team_passcode}</Text>
          </View>
        </View>
      
        {/*List of Team Members*/} 
        <View>
            <View style={{backgroundColor: "#FFFFFF",  borderTopColor: "#777777", borderTopWidth: 1}}>
              <View style={{flexDirection: "row", alignContent: "center", justifyContent: "space-between",}}>
                <Text style={{fontSize: 14, opacity: 0.4, marginTop: 8, paddingHorizontal: 10}}>Members</Text>
                <Button  titleStyle={{fontSize: 14}} type="clear" title={"View All"} onPress={onViewMembers} />
              </View>
              <FlatList
                data={team_members}
                renderItem={({item, index}) => (renderMember(item, index))}
                keyExtractor={(item, index) => index}
                horizontal={true}
                ListEmptyComponent={<LoadingIndicator/>}
              />  
            </View>
        </View>

        {/*List of Team Entries*/}
        <View style={{flex: 1, flexDirection: "column"}}>
          <View style={{flex: 1, backgroundColor: "#FFFFFF", borderColor: "#777777", borderTopWidth: 1, borderBottomWidth: 1,}}>
            <View style={{flexDirection: "row", alignContent: "center", justifyContent: "space-between",}}>
              <Text style={{fontSize: 14, opacity: 0.4, marginTop: 8, paddingHorizontal: 10}}>Entries</Text>
              <Button  titleStyle={{fontSize: 14}} type="clear" title={"View All"} onPress={onViewEntries}  />
            </View>
            {!loadingEntries ?
            <FlatList
            style={{alignSelf: "center", paddingTop: 10,}}
              data={team_entries}
              renderItem={({item, index}) => (renderEntry(item, index))}
              keyExtractor={(item, index) => index}
              horizontal={false}
              numColumns={2}
              ListEmptyComponent={<><Text>No entries.</Text><Text>Click on "View All" to add entries.</Text></>}
            />
            : 
              <LoadingIndicator/> 
              
          }
          </View>
        </View>
      </View>
    );
  };

  /* The actual user component */
  const UserElement = ({member}) => {
    
    return(
      <View style={{marginHorizontal: 10, marginBottom: 5, alignItems:"center",}}>
        
        <Image style={{alignSelf: "center", resizeMode: "cover", 
        height: 80,
        width: 80,
        borderRadius: 100, marginBottom: 5}} source={{uri: member.imageURL}}/>
    
        
        <Text>{member.display_name}</Text>
      </View>
      
    );
  }

  /* The actual entry component */
  const EntryElement = ({entry}) => {
    
    

    return(
      <View style={{marginHorizontal: 15, marginBottom: 15, alignItems:"center"}}>
        <Image style={{ resizeMode: "cover", 
        alignSelf: "flex-start", 
        height: 115,
        width: 150,
        borderRadius: 15, marginBottom: 5, backgroundColor: "#F0F0F0"}} source={{uri: entry.image}}/>
    
        <Text>{entry.entry_name}</Text>
      </View>
      
    );
  }
  export default TeamScreen;