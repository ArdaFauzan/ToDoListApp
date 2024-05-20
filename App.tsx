import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import SlashPage from './src/components/Slash Page/SlashPage';
import RegisterPage from './src/components/Register/RegisterPage';
import SignInPage from './src/components/Login/SignInPage';
import Dashboard from './src/components/Dashboard/Dashboard';
import ForgotPassword from './src/components/Login/ForgotPassword';
import CreateNewPassword from './src/components/Login/CreateNewPassword';
import {Provider} from 'react-redux';
import store from './src/components/Redux/store';
import {getDataAsync} from './src/components/Utils/AsyncStorage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getDataAsync('token');
      setToken(storedToken);
      setIsLoading(false);
    };

    fetchToken();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SlashPager"
          screenOptions={{headerShown: false}}>
          {token == null ? (
            <>
              <Stack.Screen name="SlashPage" component={SlashPage} />
              <Stack.Screen name="SignInPage" component={SignInPage} />
              <Stack.Screen name="RegisterPage" component={RegisterPage} />
            </>
          ) : (
            <Stack.Screen name="Dashboard" component={Dashboard} />
          )}
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
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
