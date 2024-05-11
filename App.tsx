import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SlashPage from './src/components/Slash Page/SlashPage';
import RegisterPage from './src/components/Register/RegisterPage';
import SignInPage from './src/components/Login/SignInPage';
import Dashboard from './src/components/Dashboard/Dashboard';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SlashPage"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SlashPage" component={SlashPage} />
        <Stack.Screen name="SignInPage" component={SignInPage} />
        <Stack.Screen name="RegisterPage" component={RegisterPage} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
