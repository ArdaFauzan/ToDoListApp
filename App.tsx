import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Provider} from 'react-redux';
import store from './src/components/Redux/store';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from './src/components/Dashboard/Dashboard';
import CreateNewPassword from './src/components/Login/CreateNewPassword';
import SignInPage from './src/components/Login/SignInPage';
import RegisterPage from './src/components/Register/RegisterPage';
import SlashPage from './src/components/Slash Page/SlashPage';
import Loading from './src/components/Dashboard/Loading';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Loading" component={Loading} />
          <Stack.Screen name="SlashPage" component={SlashPage} />
          <Stack.Screen name="SignInPage" component={SignInPage} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="RegisterPage" component={RegisterPage} />
          <Stack.Screen
            name="CreateNewPassword"
            component={CreateNewPassword}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
