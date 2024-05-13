import React from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {deviceHeight, deviceWidth} from '../Utils/Dimension';
import SlashImage from '../../assets/slashimage.svg';
import {useSelector} from 'react-redux';

const SlashPage2 = ({navigation}) => {
  // const globalState = useSelector(state => state.DashboardReducer);
  // console.log(globalState);
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
        <SlashImage height={261} width={270} />
        <Text style={styles.tittleText}>Get Things Done With TODO</Text>
        <Text style={styles.descText}>
          Lorem ipsum dolor sit amet consectetur. Tellus consequat euismod cras
          sapien venenatis.
        </Text>

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
  background: {
    height: deviceHeight / 5,
    width: deviceWidth / 2,
  },
  contentWrapping: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tittleText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: hp('1.9%'),
  },
  descText: {
    fontSize: 15,
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: hp('1%'),
    marginHorizontal: wp('6%'),
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

export default SlashPage2;
