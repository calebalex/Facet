import React from 'react';
import { Icon } from 'react-native-elements';
import { HomeScreen, EntriesScreen, TeamsScreen, ProfileScreen, } from '../screenIndex.js';
import { LoadingIndicator} from '../componentIndex.js';
import { NavigationContainer, } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { connectAuthEmulator, getAuth, } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const Tab = createBottomTabNavigator();
const auth = getAuth();


const NavContainer = () => {
  
  const [user] = useAuthState(auth);

  const navOptions =({ route, navigation }) => ({
    tabBarIcon: (focused, color, size) => {
      let iconName;
      let fontName;
      let iconColor=color;

      switch(route.name) {
        case "Home":
          iconName="home";
          fontName="font-awesome-5";
          break;
        case "Entries Screen":
          iconName="clipboard-list"
          fontName="font-awesome-5";
          break;
        case "Teams Screen":
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
      
      return (
        <Icon 
          name={iconName}
          type={fontName} 
          size={size}
          color={iconColor}
        />
      );
    },
    tabBarShowLabel: false,
  });

  return(
    user ? 
    <>
    <NavigationContainer>
      <Tab.Navigator screenOptions={navOptions} >
        {//<Tab.Screen name="Home" component={HomeScreen} />
        }
        <Tab.Screen name="Entries Screen" component={EntriesScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Teams Screen" component={TeamsScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Profile" component={ProfileScreen}/>
      </Tab.Navigator>
    </NavigationContainer>

    {/*Modal for adding entries to firebase*/}
   
  </>
  :
  <LoadingIndicator color="#276174" />
  );
};

export default NavContainer;