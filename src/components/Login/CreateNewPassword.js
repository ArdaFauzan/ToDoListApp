import React, {useState} from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {deviceHeight, deviceWidth} from '../Utils/Dimension';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CreateNewPassword = ({navigation}) => {
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
  });

  const updateState = (key, value) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
      />

      <ImageBackground
        source={require('../../assets/Elipse.png')}
        style={styles.background}
      />

      <View style={styles.contentWrapping}>
        <View style={styles.tittleWrapping}>
          <Text style={styles.tittleText}>Create a new password</Text>
          <Text style={styles.descText}>
            Your new password must be different from the previos password you
            used
          </Text>
        </View>

        <Text style={styles.text}>Password*</Text>

        <TextInput
          value={state.password}
          onChangeText={value => updateState('password', value)}
          placeholderTextColor={'rgba(0, 0, 0, 0.75)'}
          style={styles.passwordTextInput}
        />
        <Text style={styles.text}>Confirm Password*</Text>

        <TextInput
          value={state.confirmPassword}
          onChangeText={value => updateState('confirmPassword', value)}
          placeholderTextColor={'rgba(0, 0, 0, 0.75)'}
          style={styles.confirmPasswordTextInput}
        />

        <TouchableOpacity onPress={() => {}} style={styles.buttonWrapping}>
          <Text style={styles.buttonText}>Create Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    height: deviceHeight / 5,
    width: deviceWidth / 2,
  },
  contentWrapping: {
    justifyContent: 'center',
  },
  tittleWrapping: {
    alignItems: 'center',
  },
  tittleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: hp('1%'),
  },
  descText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
    marginHorizontal: 60,
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  text: {
    fontSize: 14,
    color: '#000000',
    marginLeft: wp('11%'),
    marginBottom: hp('1.5%'),
  },
  passwordTextInput: {
    width: 306,
    height: 54,
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
    marginBottom: hp('4%'),
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 20,
    fontWeight: '400',
    alignSelf: 'center',
  },
  confirmPasswordTextInput: {
    width: 306,
    height: 54,
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
    marginBottom: hp('3%'),
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 20,
    fontWeight: '400',
    alignSelf: 'center',
  },
  buttonWrapping: {
    backgroundColor: '#50C2C9',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 284,
    height: 74,
    marginTop: hp('2%'),
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CreateNewPassword;
