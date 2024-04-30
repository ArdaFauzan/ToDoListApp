import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SlashPage from './src/js/SlashPage';
import RegisterPage from './src/js/RegisterPage';
import SignInPage from './src/js/SignInPage';
import Dashboard from './src/js/Dashboard';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignInPage"
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
