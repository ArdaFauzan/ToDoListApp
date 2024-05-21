import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error storing data: ', error);
  }
};

export const getDataAsync = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('Error get data: ', error);
  }
};

export const deleteData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error('Error delete data: ', err);
  }
};
