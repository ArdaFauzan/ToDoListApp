import React from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {deviceHeight, deviceWidth} from './Dimension';
import SlashImage from '../assets/slashimage.svg';

const SlashPage = ({navigation}) => {
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
        <SlashImage height={261} width={270} />

        <View>
          <Text style={styles.tittleText}>Get Things Done With TODO</Text>
          <Text style={styles.descText}>
            Lorem ipsum dolor sit amet consectetur. Tellus consequat euismod
            cras sapien venenatis.
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignInPage')}>
          <View style={styles.buttonWrapping}>
            <Text style={styles.buttonText}>Get Started</Text>
          </View>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 43,
  },
  tittleText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 26,
  },
  descText: {
    fontSize: 15,
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 25,
  },
  buttonWrapping: {
    backgroundColor: '#50C2C9',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 284,
    height: 74,
    marginTop: 26,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SlashPage;
