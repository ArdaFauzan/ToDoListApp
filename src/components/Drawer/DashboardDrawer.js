import {DrawerContentScrollView} from '@react-navigation/drawer';
import React, {useState} from 'react';
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
import {deleteData} from '../Utils/AsyncStorage';

const DashboardDrawer = ({props, navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(prevState => !prevState);
  };

  const deleteToken = async () => {
    try {
      await deleteData('token');
      Alert.alert('Warning!', 'You are logged out, please Log In again', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('SlashPage'),
        },
      ]);
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
      {...props}
      contentContainerStyle={styles.container}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
      />

      <ImageBackground
        source={require('../../assets/drawerbackground.png')}
        style={styles.background}>
        <Text style={styles.settingText}>Settings</Text>
      </ImageBackground>

      <View style={styles.settingsContainer}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Dark Mode</Text>
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            trackColor={{false: '#c7c7c7', true: '#000000'}}
            thumbColor={isEnabled ? '#ffffff' : '#000000'}
          />
        </View>
        <View style={{flex: 1}} />
        <TouchableOpacity
          onPress={() => deleteToken()}
          style={styles.logOutbutton}>
          <Text style={styles.logOutText}>Log Out</Text>
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
    color: '#000000',
    fontWeight: '500',
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
    color: 'rgba(255, 0, 0, 0.85)',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default DashboardDrawer;
