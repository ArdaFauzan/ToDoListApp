import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const AlertText = ({text}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginLeft: wp('17%'),
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E72929',
  },
});

export default AlertText;
