import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

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
    marginLeft: 60,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E72929',
  },
});

export default AlertText;
