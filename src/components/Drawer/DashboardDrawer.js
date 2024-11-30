import {DrawerContentScrollView} from '@react-navigation/drawer';
import React, {useContext, useState} from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardDrawer = ({navigation}) => {
  const {theme, updateTheme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const dispatch = useDispatch();

  const [isEnabled, setIsEnabled] = useState(theme.mode === 'dark');

  const updateState = (key, value, isGlobal = false) => {
    if (isGlobal) {
      dispatch({type: key, inputValue: value});
    }
  };

  const toggleSwitch = () => {
    updateTheme();
    setIsEnabled(prevState => !prevState);
  };

  const deleteData = () => {
    try {
      Alert.alert(
        'Warning!',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Logout'),
            style: 'cancel',
          },
          {
            text: 'Yes, Logout',
            onPress: async () => {
              await AsyncStorage.clear(); // Hapus semua data di AsyncStorage
              updateState('SET_IMAGE_URI', null, true);
              updateState('SET_TODOS', [], true);
              updateState('SET_LOGGED_OUT', true, true);
              navigation.navigate('SlashPage');
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error logging out: ', error);
      Alert.alert(
        'Error',
        'An error occurred while logging out. Please try again.',
      );
    }
  };

  return (
    <DrawerContentScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: activeColors.primary},
      ]}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={'transparent'}
      />

      <ImageBackground
        source={require('../../assets/drawerbackground.png')}
        style={styles.background}>
        <Text style={styles.settingText}>Settings</Text>
      </ImageBackground>

      <View style={styles.settingsContainer}>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchText, {color: activeColors.text}]}>
            Dark Mode
          </Text>
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            trackColor={{false: activeColors.switch, true: activeColors.switch}}
            thumbColor={
              isEnabled ? activeColors.switchThumb : activeColors.switchThumb
            }
          />
        </View>
        <View style={styles.wrapping} />
        <TouchableOpacity
          onPress={deleteData}
          style={[
            styles.logOutbutton,
            {backgroundColor: activeColors.logOutbutton},
          ]}>
          <Text style={[styles.logOutText, {color: activeColors.logOutText}]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  background: {
    width: '100%',
    height: 192,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight * -2,
  },
  settingText: {
    color: '#000000',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '600',
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  switchContainer: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
    fontWeight: '500',
  },
  wrapping: {
    flex: 1,
  },
  logOutbutton: {
    width: 221,
    height: 50,
    borderRadius: 16,
    borderColor: '#000000',
    borderWidth: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: hp('2%'),
  },
  logOutText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default DashboardDrawer;
