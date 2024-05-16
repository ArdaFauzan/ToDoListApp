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
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {deviceHeight, deviceWidth} from '../Utils/Dimension';
import SignInImage from '../../assets/signinimage.svg';
import Axios from 'axios';
import {BASE_API} from '../Utils/API';

const SignInPage = ({navigation}) => {
  const [state, setState] = useState({
    signIn: '',
    password: '',
    showPassword: false,
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

  const loginHandler = async () => {
    const data = {
      email: state.signIn,
      password: state.password,
    };

    await Axios.post(`${BASE_API}/login`, data)
      .then(res => {
        Alert.alert('Warning!', 'Login success', [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('Dashboard', {email: state.signIn}),
          },
        ]);
      })
      .catch(error => {
        Alert.alert('Warning!', 'Email or Password is wrong!');
      });
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
        />

        <View style={styles.passwordWrapping}>
          <TextInput
            value={state.password}
            onChangeText={value => updateState('password', value)}
            placeholder="Enter your Password"
            placeholderTextColor="rgba(0, 0, 0, 0.75)"
            secureTextEntry={!state.showPassword}
            style={styles.passwordTextInput}
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
          <Text style={styles.dontHaveAccountText}>Don’t have a account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterPage')}>
            <Text style={styles.signUpText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
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
