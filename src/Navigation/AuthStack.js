import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInPage from '../components/Login/SignInPage';
import RegisterPage from '../components/Register/RegisterPage';
import SlashPage from '../components/Slash Page/SlashPage';
import CreateNewPassword from '../components/Login/CreateNewPassword';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SlashPage" component={SlashPage} />
      <Stack.Screen name="SignInPage" component={SignInPage} />
      <Stack.Screen name="RegisterPage" component={RegisterPage} />
      <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
    </Stack.Navigator>
  );
};
