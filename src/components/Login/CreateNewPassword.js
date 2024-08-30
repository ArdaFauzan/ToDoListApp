import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Image,
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
import Toast from 'react-native-root-toast';
import LoginToast from '../Toast/LoginToast';
import AlertText from '../Texts/AlertText';

const CreateNewPassword = ({navigation, route}) => {
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    showPassword: false,
    backPressedOnce: false,
    showPasswordAlert: false,
    showConfirmPasswordAlert: false,
  });

  const {data} = route.params;

  const updateState = (key, value) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onBackPress = useCallback(() => {
    if (state.backPressedOnce) {
      BackHandler.exitApp();
      return true;
    } else {
      updateState('backPressedOnce', true);
      showCustomToast();
      setTimeout(() => {
        updateState('backPressedOnce', false);
      }, 2000);
      return true;
    }
  }, [state.backPressedOnce]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [onBackPress]);

  const showCustomToast = () => {
    const toast = Toast.show(
      <LoginToast message="Press again to close the app" />,
      {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        containerStyle: {
          backgroundColor: '#50C2C9',
          borderRadius: 30,
          width: 250,
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
      },
    );

    setTimeout(() => {
      Toast.hide(toast);
    }, 1000); // Duration in milliseconds (1 second)
  };

  const createNewPassword = async () => {
    const newPassword = {
      password: state.password,
      passwordConfirm: state.confirmPassword,
    };

    if (!state.password || !state.confirmPassword) {
      Alert.alert('Warning!', 'Please fill in all fields');
    } else if (state.showPasswordAlert && state.showConfirmPasswordAlert) {
      Alert.alert('Warning!', 'Please, check again all field');
    } else {
      try {
        await Axios.put(
          `${BASE_API}/createnewpassword/${data.email}`,
          newPassword,
        );
        Alert.alert(
          'Warning!',
          'Password success changed, please Log In again',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SignInPage'),
            },
          ],
        );
      } catch (error) {
        Alert.alert('Error', error.response.data.message);
      }
    }
  };

  const showPasswordHandler = () => {
    updateState('showPassword', !state.showPassword);
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
          <View style={styles.tittleWrapping}>
            <Text style={styles.tittleText}>Create a new password</Text>
            <Text style={styles.descText}>
              Your new password must be different from the previous password you
              used
            </Text>
          </View>

          <Text style={styles.text}>Password*</Text>

          <View style={styles.passwordTextInputWrapping}>
            <TextInput
              value={state.password}
              onChangeText={value => handlePasswordField(value)}
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

          {state.showPasswordAlert ? (
            <AlertText text={'Your password must have min 8 character!'} />
          ) : null}

          <Text style={[styles.text, {marginTop: hp('2%')}]}>
            Confirm Password*
          </Text>

          <TextInput
            value={state.confirmPassword}
            onChangeText={value => handleConfirmPasswordField(value)}
            placeholderTextColor={'rgba(0, 0, 0, 0.75)'}
            style={styles.confirmPasswordTextInput}
            secureTextEntry={true}
          />

          {state.showConfirmPasswordAlert ? (
            <AlertText text={'Password do not match!'} />
          ) : null}

          <TouchableOpacity
            onPress={createNewPassword}
            style={styles.buttonWrapping}>
            <Text style={styles.buttonText}>Create Password</Text>
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
  passwordTextInput: {
    width: 306,
    height: 54,
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
    borderRadius: 27,
    paddingLeft: 34,
    paddingRight: 20,
    fontWeight: '400',
    alignSelf: 'center',
  },
  showPasswordTouch: {
    position: 'absolute',
    right: 70,
    top: 15,
  },
  eyeImage: {
    height: 25,
    width: 25,
  },
  confirmPasswordTextInput: {
    width: 306,
    height: 54,
    backgroundColor: '#D8D8D8',
    color: 'black',
    fontSize: 14,
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
    marginTop: hp('4%'),
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
