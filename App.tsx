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
import Loading from './src/components/Splash Screen/Loading';
import ForgotPassword from './src/components/Login/ForgotPassword';
import DashboardDrawer from './src/components/Drawer/DashboardDrawer';
import {ThemeProvider} from './src/components/Context/ThemeContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <DashboardDrawer {...props} />}>
      <Drawer.Screen name="DashboardDrawer" component={Dashboard} />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="SlashPage" component={SlashPage} />
            <Stack.Screen name="SignInPage" component={SignInPage} />
            <Stack.Screen name="Dashboard" component={DrawerNavigator} />
            <Stack.Screen name="RegisterPage" component={RegisterPage} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen
              name="CreateNewPassword"
              component={CreateNewPassword}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
