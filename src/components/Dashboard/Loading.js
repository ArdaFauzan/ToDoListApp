import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {getDataAsync} from '../Utils/AsyncStorage';

const Loading = ({navigation}) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await getDataAsync('token');
        const timer = setTimeout(() => {
          if (userToken !== null) {
            navigation.navigate('Dashboard');
          } else {
            navigation.navigate('SlashPage');
          }
        }, 2000);

        return () => clearTimeout(timer);
      } catch (e) {
        console.log('Restoring token failed: ', e);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Progress.CircleSnail thickness={8} size={100} color={'#50C2C9'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
