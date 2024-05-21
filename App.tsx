import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import store from './src/components/Redux/store';
import {getDataAsync} from './src/components/Utils/AsyncStorage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AppStack} from './src/Navigation/AppStack';
import {AuthStack} from './src/Navigation/AuthStack';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const isLogin = async () => {
      let userToken;
      try {
        userToken = await getDataAsync('token');
      } catch (e) {
        console.log('Restoring token failed: ', e);
      }
      setToken(userToken);
    };

    isLogin();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {token !== null ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </Provider>
  );
};

export default App;
