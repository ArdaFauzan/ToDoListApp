import React, {useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Camera from '../../assets/camera.svg';
import DarkCamera from '../../assets/cameradark.svg';
import Gallery from '../../assets/gallery.svg';
import DarkGallery from '../../assets/gallerydark.svg';
import Trash from '../../assets/trashphoto.svg';
import DarkTrash from '../../assets/trashphotodark.svg';
import {useDispatch, useSelector} from 'react-redux';
import {Image as ImageCompressor} from 'react-native-compressor';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPhoto = ({onClose}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const dispatch = useDispatch();
  const globalState = useSelector(state => state.DashboardReducer);

  const options = {
    saveToPhotos: false, // Tidak perlu save ke photos
    mediaType: 'photo',
    includeBase64: false,
    quality: 0.8,
    maxWidth: 800, // Batasi ukuran untuk menghemat storage
    maxHeight: 800,
  };

  const getImage = async camera => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'ios') return true;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    const requestGalleryPermission = async () => {
      if (Platform.OS === 'ios') return true;

      const granted = await PermissionsAndroid.request(
        Platform.Version < 33
          ? PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          : PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'App Gallery Permission',
          message: 'App needs access to your photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    try {
      if (camera && (await requestCameraPermission())) {
        launchCamera(options, handleImageResponse);
      } else if (!camera && (await requestGalleryPermission())) {
        launchImageLibrary(options, handleImageResponse);
      } else {
        Alert.alert(
          'Permission Denied',
          'Camera/Gallery permission is required',
        );
      }
    } catch (error) {
      console.log('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request permission');
    }
  };

  const handleImageResponse = res => {
    if (res.didCancel) {
      console.log('User cancelled image operation');
      return;
    }

    if (res.error) {
      console.log('Image operation error: ', res.error);
      Alert.alert('Error', `Image picker error: ${res.error}`);
      return;
    }

    if (res.assets && res.assets.length > 0) {
      const asset = res.assets[0];

      if (asset.uri) {
        processAndSaveImage(asset.uri);
      } else {
        Alert.alert('Error', 'No image URI found');
      }
    } else {
      console.log('No image assets found');
      Alert.alert('Error', 'No image selected');
    }
  };

  const processAndSaveImage = async uri => {
    try {
      // Compress image untuk menghemat storage space
      let processedImageUri;
      try {
        processedImageUri = await ImageCompressor.compress(uri, {
          compressionMethod: 'auto',
          quality: 0.7, // Compress lebih agresif untuk local storage
          maxWidth: 600,
          maxHeight: 600,
        });
      } catch (compressionError) {
        console.log(
          'Image compression failed, using original:',
          compressionError,
        );
        processedImageUri = uri; // Fallback ke URI original
      }

      // Simpan URI ke AsyncStorage
      await saveImageUriToStorage(processedImageUri);

      // Update Redux state
      dispatch({type: 'SET_IMAGE_URI', inputValue: processedImageUri});

      // Close modal setelah berhasil
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.log('Error processing image:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  const saveImageUriToStorage = async uri => {
    try {
      // Generate unique key untuk setiap user (jika ada user_id)
      const storageKey = globalState.user_id
        ? `userPhoto_${globalState.user_id}`
        : 'userPhotoUri';

      await AsyncStorage.setItem(storageKey, uri);

      // Juga simpan ke key umum untuk backward compatibility
      await AsyncStorage.setItem('userPhotoUrl', uri);
    } catch (error) {
      console.log('Error saving photo URI to AsyncStorage:', error);
      throw error;
    }
  };

  const removeImageUriFromStorage = async () => {
    try {
      // Remove dari kedua key
      const storageKey = globalState.user_id
        ? `userPhoto_${globalState.user_id}`
        : 'userPhotoUri';

      await AsyncStorage.removeItem(storageKey);
      await AsyncStorage.removeItem('userPhotoUrl');
    } catch (error) {
      console.log('Error removing photo URI from AsyncStorage:', error);
      throw error;
    }
  };

  const deletePhoto = async () => {
    try {
      // Remove URI dari AsyncStorage
      await removeImageUriFromStorage();

      // Update Redux state
      dispatch({type: 'SET_IMAGE_URI', inputValue: ''});
    } catch (error) {
      console.log('Delete error:', error);
      Alert.alert('Error', 'Failed to delete photo. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.container}>
        <View
          style={[
            styles.contentWrapping,
            {backgroundColor: activeColors.primary},
          ]}>
          <Text style={[styles.profilePhotoText, {color: activeColors.text}]}>
            Profile Photo
          </Text>

          <View style={styles.imageWrapping}>
            <TouchableOpacity
              onPress={() => getImage(true)}
              style={styles.actionButton}>
              {theme.mode === 'light' ? (
                <Camera width={60} height={60} />
              ) : (
                <DarkCamera width={60} height={60} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => getImage(false)}
              style={styles.actionButton}>
              {theme.mode === 'light' ? (
                <Gallery width={60} height={60} />
              ) : (
                <DarkGallery width={60} height={60} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={deletePhoto} style={styles.actionButton}>
              {theme.mode === 'light' ? (
                <Trash width={60} height={60} />
              ) : (
                <DarkTrash width={60} height={60} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentWrapping: {
    width: 271,
    height: 130,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: hp('1%'),
    marginBottom: hp('40%'),
  },
  profilePhotoText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  imageWrapping: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('1%'),
  },
  actionButton: {
    alignItems: 'center',
  },
});

export default AddPhoto;
