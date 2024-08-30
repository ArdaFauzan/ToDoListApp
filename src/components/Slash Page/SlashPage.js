import React, {useEffect, useRef} from 'react';
import {
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SlashImage from '../../assets/slashimage.svg';
import {deviceHeight, deviceWidth} from '../Utils/Dimension';

const SlashPage = ({navigation}) => {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fungsi untuk memulai animasi
    const startAnimation = () => {
      // Reset posisi ke nilai awal
      moveAnim.setValue(0);
      // Mulai animasi
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim, {
            toValue: 10, // Menggerakkan gambar ke bawah
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: 0, // Menggerakkan gambar kembali ke atas
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startAnimation();
  }, []);

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
        <Animated.View
          style={{
            transform: [{translateY: moveAnim}],
          }}>
          <SlashImage height={261} width={270} />
        </Animated.View>
        <Text style={styles.tittleText}>Get Things Done With TODO</Text>
        <Text style={styles.descText}>Let’s start your day now</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignInPage')}
          style={styles.buttonWrapping}>
          <Text style={styles.buttonText}>Get Started</Text>
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
    height: deviceHeight / 4,
    width: deviceWidth * 0.65,
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
    marginBottom: hp('3%'),
  },
  descText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: hp('1%'),
    marginHorizontal: wp('6%'),
    marginBottom: hp('3%'),
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

export default SlashPage;
