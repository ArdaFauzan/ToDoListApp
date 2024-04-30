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
} from 'react-native';
import {deviceHeight, deviceWidth} from './Dimension';
import SignInImage from '../assets/signinimage.svg';

const SignInPage = ({navigation}) => {
  const [signIn, setSignIn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
      />

      <View style={styles.backgroundWrapping}>
        <ImageBackground
          source={require('../assets/background.png')}
          style={styles.background}
        />
      </View>

      <View style={styles.contentWrapping}>
        <Text style={styles.tittleText}>Welcome Back!</Text>
        <SignInImage height={152} width={153} />

        <View>
          <TextInput
            value={signIn}
            onChangeText={value => setSignIn(value)}
            placeholder="Enter your Email or Name"
            placeholderTextColor="rgba(0, 0, 0, 0.75)"
            style={styles.emailTextInput}
          />

          <View style={styles.passwordWrapping}>
            <TextInput
              value={password}
              onChangeText={value => setPassword(value)}
              placeholder="Enter your Password"
              placeholderTextColor="rgba(0, 0, 0, 0.75)"
              secureTextEntry={!showPassword}
              style={styles.passwordTextInput}
            />
            <TouchableOpacity
              style={styles.showPasswordTouch}
              onPress={showPasswordHandler}>
              <Image
                source={
                  showPassword
                    ? require('../assets/hide.png')
                    : require('../assets/view.png')
                }
                style={styles.eyeImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => {}} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <View style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </View>
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
  backgroundWrapping: {
    position: 'absolute',
  },
  background: {
    height: deviceHeight,
    width: deviceWidth,
  },
  contentWrapping: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tittleText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 13,
  },
  emailTextInput: {
    width: 306,
    height: 54,
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
    marginTop: 20,
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 20,
    fontWeight: '400',
  },
  passwordWrapping: {
    marginTop: 18,
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
    marginTop: 18,
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
    marginTop: 6,
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
    alignSelf: 'center',
    marginTop: 8,
  },
  dontHaveAccountText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.75)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0, 112, 112, 0.75)',
    textAlign: 'center',
  },
});

export default SignInPage;
