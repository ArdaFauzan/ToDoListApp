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
} from 'react-native';
import {deviceHeight, deviceWidth} from './Dimension';

const RegisterPage = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // handleAuthentication = async () => {
  //   auth()
  //     .createUserWithEmailAndPassword(this.state.email, this.state.pass)
  //     .then(async () => {
  //       console.log('User account created & signed in!');
  //       // Simpan email dan password
  //       await AsyncStorage.setItem(
  //         'registeredUser',
  //         JSON.stringify({
  //           email: this.state.email,
  //           password: this.state.pass,
  //           userName: this.state.name,
  //         }),
  //       );
  //       // Navigasi kembali ke halaman Sign In Page
  //       this.props.navigation.navigate('Dashboard');
  //     })
  //     .catch(error => {
  //       if (error.code === 'auth/email-already-in-use') {
  //         console.log('That email address is already in use!');
  //       }
  //       if (error.code === 'auth/invalid-email') {
  //         console.log('That email address is invalid!');
  //       }
  //       console.error(error);
  //     });
  // };

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
        <Text style={styles.tittleText}>Welcome OnBoard !</Text>
        <Text style={styles.descText}>Let’s checkup your tasks!</Text>

        <View>
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
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignInPage')}>
          <View style={styles.getStartedButtonWrapping}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </View>
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
  },
  descText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
    marginTop: 1,
  },
  textInput: {
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
  passwordTextInputWrapping: {
    marginTop: 20,
  },
  passwordTextInput: {
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
  getStartedButtonWrapping: {
    backgroundColor: '#50C2C9',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 306,
    height: 83,
    marginTop: 19,
    borderRadius: 10,
  },
  getStartedText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  alreadyAccountWrapping: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },
  alreadyAccountText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.75)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  signInText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0, 112, 112, 0.75)',
    textAlign: 'center',
  },
});

export default RegisterPage;
