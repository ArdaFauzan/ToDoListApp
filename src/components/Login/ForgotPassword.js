import React, {useState} from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
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
import Axios from 'axios';
import {BASE_API} from '@env';

const ForgotPassword = ({navigation}) => {
  const [state, setState] = useState({
    name: '',
    email: '',
  });

  const updateState = (key, value) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const checkUser = async () => {
    const data = {
      name: state.name,
      email: state.email,
    };

    if (!state.name || !state.email) {
      Alert.alert('Warning!', 'Please fill in all fields');
    }

    try {
      await Axios.post(`${BASE_API}/checknameandemail`, data);
      Alert.alert('Success!', 'Account is registered', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('CreateNewPassword', {data}),
        },
      ]);
    } catch (error) {
      Alert.alert('Warning!', 'Name or Email is not registered!');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="position">
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
            <Text style={styles.tittleText}>Forgot your password?</Text>
            <Text style={styles.descText}>
              Please, enter your name and email address in your account below
            </Text>
          </View>

          <Text style={styles.text}>Name*</Text>

          <TextInput
            value={state.name}
            onChangeText={value => updateState('name', value)}
            placeholderTextColor={'rgba(0, 0, 0, 0.75)'}
            style={styles.nameTextInput}
          />
          <Text style={styles.text}>E-mail address*</Text>

          <TextInput
            value={state.email}
            onChangeText={value => updateState('email', value)}
            placeholderTextColor={'rgba(0, 0, 0, 0.75)'}
            style={styles.emailTextInput}
          />

          <TouchableOpacity onPress={checkUser} style={styles.buttonWrapping}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    height: deviceHeight / 4,
    width: deviceWidth * 0.65,
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
  nameTextInput: {
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
  emailTextInput: {
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

export default ForgotPassword;
