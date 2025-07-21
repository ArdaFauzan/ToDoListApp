import React, {useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Camera from '../../assets/camera.svg';
import DarkCamera from '../../assets/cameradark.svg';
import Gallery from '../../assets/gallery.svg';
import DarkGallery from '../../assets/gallerydark.svg';
import Trash from '../../assets/trashphoto.svg';
import DarkTrash from '../../assets/trashphotodark.svg';
import Axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {Image as ImageCompressor} from 'react-native-compressor';
import {BASE_API} from '@env';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';

const AddPhoto = ({onClose}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const dispatch = useDispatch();
  const globalState = useSelector(state => state.DashboardReducer);

  const options = {
    saveToPhotos: true,
    mediaType: 'photo',
    includeBase64: false,
  };

  const getImage = async camera => {
    const requestCameraPermission = async () => {
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

    if (camera && (await requestCameraPermission())) {
      launchCamera(options, handleImageResponse);
    } else if (!camera && (await requestGalleryPermission())) {
      launchImageLibrary(options, handleImageResponse);
    }
  };

  const handleImageResponse = res => {
    if (res.didCancel) {
      console.log('User cancelled image operation');
    } else if (res.error) {
      console.log('Image operation error: ', res.error);
    } else if (res.assets && res.assets.length > 0) {
      const source = {uri: res.assets[0].uri};
      dispatch({type: 'SET_IMAGE_URI', inputValue: source.uri});
      postPhotoUser(source.uri);
    } else {
      console.log('No image assets found');
    }
  };

  const postPhotoUser = async uri => {
    const formData = new FormData();
    const fileExtension = uri.split('.').pop();
    let mimeType = 'image/jpeg';

    switch (fileExtension) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      default:
        mimeType = 'image/jpeg';
    }

    const compressedImage = await ImageCompressor.compress(uri, {
      compressionMethod: 'auto',
    });

    formData.append('image', {
      uri: compressedImage,
      type: mimeType,
      name: `image.${fileExtension}`,
    });

    try {
      const response = await Axios.post(
        `${BASE_API}/uploadphoto/${globalState.user_id}`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${globalState.token}`,
          },
        },
      );
      console.log('Upload success:', response.data);
    } catch (error) {
      console.log('Error uploading photo:', error.message);
    }
  };

  const deletePhotoUser = async () => {
    try {
      const res = await Axios.delete(
        `${BASE_API}/deletephoto/${globalState.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${globalState.token}`,
          },
        },
      );
      dispatch({type: 'SET_IMAGE_URI', inputValue: ''});
    } catch (error) {
      console.error('Error deleting image: ', error);
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
            <TouchableOpacity onPress={() => getImage(true)}>
              {theme.mode === 'light' ? (
                <Camera width={60} height={60} />
              ) : (
                <DarkCamera width={60} height={60} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => getImage(false)}>
              {theme.mode === 'light' ? (
                <Gallery width={60} height={60} />
              ) : (
                <DarkGallery width={60} height={60} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={deletePhotoUser}>
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
  },
  imageWrapping: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('1%'),
  },
});

export default AddPhoto;
