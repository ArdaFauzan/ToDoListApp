import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Camera from '../../assets/camera.svg';
import Gallery from '../../assets/gallery.svg';
import Trash from '../../assets/trashPhoto.svg';
import Axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {Image as ImageCompressor} from 'react-native-compressor';

const AddPhoto = ({onClose}) => {
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();

  const options = {
    saveToPhotos: true,
    mediaType: 'photo',
    includeBase64: false,
  };

  const getImage = async camera => {
    // Fungsi untuk meminta izin kamera
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

    // Fungsi untuk meminta izin galeri
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

    // Meminta izin berdasarkan pilihan pengguna
    if (camera && (await requestCameraPermission())) {
      launchCamera(options, handleImageResponse);
    } else if (!camera && (await requestGalleryPermission())) {
      launchImageLibrary(options, handleImageResponse);
    }
  };

  // Fungsi untuk menangani respons dari kamera atau galeri
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
    const name = globalState.name;
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
        `https://to-do-list-app-back-end.vercel.app/todo/uploadphoto/${name}`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Upload success:', response.data);
    } catch (error) {
      console.error('Error uploading photo:', error.message);
    }
  };

  const deletePhotoUser = () => {
    try {
      Axios.delete(
        `https://to-do-list-app-back-end.vercel.app/todo/deletephoto/${globalState.name}`,
      ).then(res => {
        dispatch({type: 'SET_IMAGE_URI', inputValue: ''});
      });
    } catch (error) {
      console.error('Error fetching image: ', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
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
            paddingTop: 10,
            marginBottom: hp('40%'),
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000000',
              textAlign: 'center',
            }}>
            Profile Photo
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 5,
            }}>
            <TouchableOpacity onPress={() => getImage(true)}>
              <Camera width={60} height={60} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => getImage(false)}>
              <Gallery width={60} height={60} />
            </TouchableOpacity>

            <TouchableOpacity onPress={deletePhotoUser}>
              <Trash width={60} height={60} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddPhoto;
