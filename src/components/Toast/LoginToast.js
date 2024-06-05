import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const LoginToast = ({message}) => (
  <View style={styles.toastContainer}>
    <Image source={require('../../assets/toast.png')} style={styles.image} />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    justifyContent: 'center',
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginToast;
