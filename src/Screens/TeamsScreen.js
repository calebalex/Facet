import React from 'react';
import { TeamEntryList, TeamList, TeamMemberList} from '../componentIndex';
import { TeamScreen, DetailScreen, TeamEditScreen, TeamLogScreen, TeamInfoEditScreen} from '../screenIndex';
import TeamDetailScreen from './TeamDetailScreen.js';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Text,
} from 'react-native';
import { StackActions } from '@react-navigation/native';

const Stack = createStackNavigator();

const TeamsScreen = () => {
    return(
      <Stack.Navigator>
      <Stack.Screen name="Teams" component={TeamList} />
      <Stack.Screen name="Team Page" component={TeamScreen} options={({route}) => ({title: route.params.team.team_name})}/>
      <Stack.Screen name="Team Entries" component={TeamEntryList} />
      <Stack.Screen name="Team Members" component={TeamMemberList} />
      <Stack.Screen name="Details" component={TeamDetailScreen} options={({route}) => ({title: route.params.entry.entry_name})}/>
      <Stack.Screen name="Edit" component={TeamEditScreen} />
      <Stack.Screen name="Service Logs" component={TeamLogScreen} />
      <Stack.Screen name="Edit Team" component={TeamInfoEditScreen} />
    </Stack.Navigator> 
    );
};

export default TeamsScreen;