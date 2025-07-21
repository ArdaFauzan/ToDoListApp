import React, {useState} from 'react';
import {
  ImageBackground,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SignInImage from '../../assets/signinimage.svg';
import Axios from 'axios';
import {BASE_API} from '@env';
import {storeData} from '../Utils/AsyncStorage';
import {useDispatch} from 'react-redux';
import LoginToast from '../Toast/LoginToast';
import Toast from 'react-native-root-toast';
import {deviceHeight, deviceWidth} from '../Utils/Dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInPage = ({navigation}) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    signIn: '',
    password: '',
    showPassword: false,
  });

  const updateState = (key, value, isGlobal = false) => {
    if (isGlobal) {
      dispatch({type: key, inputValue: value});
    } else {
      setState(prevState => ({
        ...prevState,
        [key]: value,
      }));
    }
  };

  const showPasswordHandler = () => {
    updateState('showPassword', !state.showPassword);
  };

  const showCustomToast = () => {
    const toast = Toast.show(<LoginToast message="Login Success" />, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      containerStyle: {
        backgroundColor: '#50C2C9',
        borderRadius: 30,
        width: 170,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      shadowStyle: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
    });

    setTimeout(() => {
      Toast.hide(toast);
    }, 1000); // Duration in milliseconds (3.5 seconds)
  };

  const loginHandler = async () => {
    if (!state.signIn || !state.password) {
      Alert.alert('Warning!', 'Please fill out all fields!');
    }

    const data = {
      email: state.signIn,
      password: state.password,
    };

    try {
      const res = await Axios.post(`${BASE_API}/login`, data);
      storeData('name', res.data.name);
      storeData('token', res.data.token);
      storeData('user_id', res.data.user_id);
      updateState('SET_USER_ID', res.data.user_id, true);
      updateState('SET_TOKEN', res.data.token, true);
      showCustomToast();
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 1000);
    } catch (error) {
      Alert.alert('Warning!', error.response.data.message);
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
          <Text style={styles.tittleText}>Welcome Back!</Text>

          <View style={{marginBottom: hp('2%')}}>
            <SignInImage height={152} width={153} />
          </View>

          <TextInput
            value={state.signIn}
            onChangeText={value => updateState('signIn', value)}
            placeholder="Enter your Email"
            placeholderTextColor="rgba(0, 0, 0, 0.75)"
            style={styles.emailTextInput}
            autoCapitalize="none"
            inputMode="email"
          />

          <View style={styles.passwordWrapping}>
            <TextInput
              value={state.password}
              onChangeText={value => updateState('password', value)}
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

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={loginHandler} style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.dontHaveAccountWrapping}>
            <Text style={styles.dontHaveAccountText}>
              Don’t have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterPage')}>
              <Text style={styles.signUpText}> Sign Up</Text>
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
  background: {
    height: deviceHeight / 4,
    width: deviceWidth * 0.65,
  },
  contentWrapping: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tittleText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  emailTextInput: {
    width: 306,
    height: 54,
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
    marginBottom: hp('2%'),
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 20,
    fontWeight: '400',
  },
  passwordWrapping: {
    marginBottom: hp('1%'),
  },
  passwordTextInput: {
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 20,
    fontWeight: '400',
    height: 54,
    width: 306,
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
  forgotPassword: {
    marginTop: hp('1%'),
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0, 112, 112, 0.75)',
  },
  loginButton: {
    backgroundColor: '#50C2C9',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 306,
    height: 83,
    marginTop: hp('1%'),
    borderRadius: 10,
  },
  loginText: {
    fontSize: 25,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  dontHaveAccountWrapping: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  dontHaveAccountText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.75)',
    textAlign: 'center',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0, 112, 112, 0.75)',
    textAlign: 'center',
  },
});

export default SignInPage;
