import React, {useContext, useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Splash1 from '../../assets/splashtodolist.svg';
import Splash2 from '../../assets/splashchecklist.svg';
import {getDataAsync} from '../Utils/AsyncStorage';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';

const Loading = ({navigation}) => {
  const {theme, updateTheme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

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

    const fetchTheme = async () => {
      try {
        const getData = await getDataAsync('theme');
        const getTheme = JSON.parse(getData);

        if (getTheme) {
          updateTheme(getTheme);
        }
      } catch (error) {
        console.log('Restoring theme failed: ', error);
      }
    };

    checkLoginStatus();
    fetchTheme();
  }, [navigation]);

  return (
    <View style={[styles.container, {backgroundColor: activeColors.primary}]}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'light' ? 'dark-content' : activeColors.text}
        backgroundColor={'transparent'}
      />

      <View style={styles.splash1}>
        <Splash1 width={57} height={57} />
      </View>

      <View style={styles.splash2}>
        <Splash2 width={156} height={168} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  splash1: {
    position: 'relative',
    right: 100,
    bottom: 80,
    marginLeft: 70,
  },
  splash2: {
    position: 'absolute',
    left: 150,
  },
});

export default Loading;
