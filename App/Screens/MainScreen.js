import React from 'react';
import {StyleSheet} from 'react-native';
import { Icon, Button} from 'react-native-elements';
import { HomeScreen, EntriesScreen, TeamsScreen, ProfileScreen, } from '../screenIndex.js';

import { AuthContext } from '../Contexts/AuthContext.js';

import { NavigationContainer, } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { getAuth, } from 'firebase/auth';

const Tab = createBottomTabNavigator();
const auth = getAuth();

const MainScreen = () => {

  return(
    <AuthContext.Provider value={auth}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={ ({ route, navigation }) => ({
          tabBarIcon: (focused, color, size) => {
            let iconName;
            let fontName;
            let iconColor=color;
            switch(route.name) {
              case "Home":
                iconName="home";
                fontName="font-awesome-5";
                break;
              case "Entries":
                iconName="clipboard-list"
                fontName="font-awesome-5";
                break;
              case "Teams":
                iconName="users";
                fontName="font-awesome";
                break;
              case "Profile":
                iconName="account-circle";
                fontName="material-community-icons";
                break;
              default:
                iconName="";
                fontName="";
                break;
            } 
            
            return <Icon 
              name={iconName}
              type={fontName} 
              size={size}
              color={iconColor}
            />;
          },
          tabBarShowLabel: false,
        })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Entries" component={EntriesScreen} options={{ headerRight: () => {
            return(
              <Button 
                icon={<Icon name='add' type='ionicons' size={30}/>} 
                buttonStyle={{backgroundColor: "#FFFFFF"}} 
                containerStyle={{marginHorizontal: 15}}
                onPress={()=>{console.log("Pressed")}}
              />
            );
          }}}/>
          <Tab.Screen name="Teams" component={TeamsScreen}/>
          <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
    );
};

export default MainScreen;