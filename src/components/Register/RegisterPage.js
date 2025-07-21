import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {deviceHeight, deviceWidth} from '../Utils/Dimension';
import Axios from 'axios';
import {BASE_API} from '@env';
import AlertText from '../Texts/AlertText';
import validator from 'email-validator';

const RegisterPage = ({navigation}) => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showEmailAlert: false,
    showPasswordAlert: false,
    showConfirmPasswordAlert: false,
  });

  const updateState = (key, value) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const showPasswordHandler = () => {
    updateState('showPassword', !state.showPassword);
  };

  const createNewUser = async () => {
    const data = {
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirm: state.confirmPassword,
    };

    try {
      await Axios.post(`${BASE_API}/register`, data).then(res => {
        Alert.alert('Warning!', 'Sign Up success, Please Log In again');
        navigation.navigate('SignInPage');
      });
    } catch (error) {
      Alert.alert('Warning!', 'Email already in use');
    }
  };

  const registerHandler = () => {
    if (
      !state.name ||
      !state.email ||
      !state.password ||
      !state.confirmPassword
    ) {
      Alert.alert('Warning!', 'Please fill in all fields');
    } else if (
      state.showEmailAlert &&
      state.showPasswordAlert &&
      state.showConfirmPasswordAlert
    ) {
      Alert.alert('Warning!', 'Please, check again all field');
    } else {
      createNewUser();
    }
  };

  const handleEmailValidation = text => {
    updateState('email', text);
    if (validator.validate(text)) {
      updateState('showEmailAlert', false);
    } else {
      updateState('showEmailAlert', true);
    }
  };

  const handlePasswordField = text => {
    updateState('password', text);
    if (state.password.length < 8) {
      updateState('showPasswordAlert', true);
    } else {
      updateState('showPasswordAlert', false);
    }
  };

  const handleConfirmPasswordField = text => {
    updateState('confirmPassword', text);
    if (state.password !== text) {
      updateState('showConfirmPasswordAlert', true);
    } else {
      updateState('showConfirmPasswordAlert', false);
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
          <Text style={styles.tittleText}>Welcome OnBoard !</Text>
          <Text style={styles.descText}>Let’s checkup your tasks!</Text>

          <TextInput
            value={state.name}
            onChangeText={value => updateState('name', value)}
            placeholder="Enter your Name"
            placeholderTextColor="rgba(0, 0, 0, 0.75)"
            style={[styles.textInput, {marginBottom: hp('2%')}]}
          />
          <TextInput
            value={state.email}
            onChangeText={value => handleEmailValidation(value)}
            placeholder="Enter your Email"
            placeholderTextColor="rgba(0, 0, 0, 0.75)"
            style={styles.textInput}
            autoCapitalize="none"
            inputMode="email"
          />

          {state.showEmailAlert ? (
            <AlertText text={'Your email is wrong!'} />
          ) : null}

          <View style={styles.passwordTextInputWrapping}>
            <TextInput
              value={state.password}
              onChangeText={value => handlePasswordField(value)}
              placeholder="Enter your Password"
              placeholderTextColor="rgba(0, 0, 0, 0.75)"
              secureTextEntry={!state.showPassword}
              style={styles.passwordTextInput}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.showPasswordTouch}
              onPress={showPasswordHandler}>
              <Image
                source={
                  state.showPassword
                    ? require('../../assets/hide.png')
                    : require('../../assets/view.png')
                }
                style={styles.eyeImage}
              />
            </TouchableOpacity>
          </View>

          {state.showPasswordAlert ? (
            <AlertText text={'Your password must have min 8 character!'} />
          ) : null}

          <TextInput
            value={state.confirmPassword}
            onChangeText={value => handleConfirmPasswordField(value)}
            placeholder="Confirm your Password"
            placeholderTextColor="rgba(0, 0, 0, 0.75)"
            secureTextEntry={true}
            style={[styles.textInput, {marginTop: hp('2%')}]}
            autoCapitalize="none"
          />

          {state.showConfirmPasswordAlert ? (
            <AlertText text={'Password do not match!'} />
          ) : null}

          <TouchableOpacity
            onPress={registerHandler}
            style={styles.buttonWrapping}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <View style={styles.alreadyAccountWrapping}>
            <Text style={styles.alreadyAccountText}>
              Already have a account ?
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('SignInPage')}>
              <Text style={styles.signInText}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapping: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    height: deviceHeight / 4,
    width: deviceWidth * 0.65,
  },
  tittleText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  descText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
    marginBottom: hp('1%'),
  },
  textInput: {
    width: 306,
    height: 54,
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 20,
    fontWeight: '400',
  },
  passwordTextInputWrapping: {
    marginTop: hp('2%'),
  },
  passwordTextInput: {
    width: 306,
    height: 54,
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 50,
    fontWeight: '400',
  },
  showPasswordTouch: {
    position: 'absolute',
    right: 20,
    top: 17,
  },
  eyeImage: {
    height: 20,
    width: 20,
  },
  buttonWrapping: {
    backgroundColor: '#50C2C9',
    justifyContent: 'center',
    width: 306,
    height: 83,
    marginTop: hp('2%'),
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  alreadyAccountWrapping: {
    flexDirection: 'row',
    marginTop: hp('0.8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadyAccountText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.75)',
  },
  signInText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0, 112, 112, 0.75)',
  },
});

export default RegisterPage;
