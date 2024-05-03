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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {deviceHeight, deviceWidth} from './Dimension';
import Axios, {all} from 'axios';

const RegisterPage2 = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const createNewUser = async () => {
    const data = {
      name,
      email,
      password,
      passwordConfirm: confirmPassword,
    };

    try {
      await Axios.post(
        'https://to-do-list-app-back-end.vercel.app/todo/register',
        data,
      ).then(response => {
        Alert.alert('Warning!', 'Sign up success, Please log in again');
        navigation.navigate('SignInPage');
      });
    } catch (error) {
      Alert.alert('Warning!', 'Email already in use');
    }
  };

  const registerHandler = () => {
    if (password !== confirmPassword) {
      console.warn('Password do not match');
    } else {
      createNewUser();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
      />

      <ImageBackground
        source={require('../assets/Elipse.png')}
        style={styles.background}
      />

      <View style={styles.contentWrapping}>
        <Text style={styles.tittleText}>Welcome OnBoard !</Text>
        <Text style={styles.descText}>Let’s checkup your tasks!</Text>

        <TextInput
          value={name}
          onChangeText={value => setName(value)}
          placeholder="Enter your Name"
          placeholderTextColor="rgba(0, 0, 0, 0.75)"
          style={styles.textInput}
        />
        <TextInput
          value={email}
          onChangeText={value => setEmail(value)}
          placeholder="Enter your Email"
          placeholderTextColor="rgba(0, 0, 0, 0.75)"
          style={styles.textInput}
        />

        <View style={styles.passwordTextInputWrapping}>
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

        <TextInput
          value={confirmPassword}
          onChangeText={value => setConfirmPassword(value)}
          placeholder="Confirm your Password"
          placeholderTextColor="rgba(0, 0, 0, 0.75)"
          secureTextEntry={true}
          style={styles.textInput}
        />

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
    height: deviceHeight / 5,
    width: deviceWidth / 2,
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
    marginBottom: hp('2%'),
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 20,
    fontWeight: '400',
  },
  passwordTextInputWrapping: {
    marginBottom: hp('2%'),
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
    marginTop: hp('1%'),
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

export default RegisterPage2;
