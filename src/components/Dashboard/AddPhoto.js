import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Camera from '../../assets/camera.svg';
import Gallery from '../../assets/gallery.svg';
import Trash from '../../assets/trashPhoto.svg';
import Axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {Image as ImageCompressor} from 'react-native-compressor';

const AddPhoto = ({onClose, setUserImageUri}) => {
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();

  const options = {
    saveToPhotos: true,
    mediaType: 'photo',
    includeBase64: false,
  };

  const getImageLibrary = () => {
    launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('Image picker error: ', res.error);
      } else {
        const source = res.assets[0].uri;
        dispatch({type: 'SET_IMAGE_URI', inputValue: source.uri});
        postPhotoUser(source);
        console.log(source);
      }
    });
  };

  const postPhotoUser = async uri => {
    const formData = new FormData();
    const name = globalState.name;

    let fileExtension = uri.split('.').pop();

    let mimeType = 'image/jpeg';
    if (fileExtension === 'png') {
      mimeType = 'image/png';
    } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (fileExtension === 'gif') {
      mimeType = 'image/gif';
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
            <TouchableOpacity>
              <Camera width={60} height={60} />
            </TouchableOpacity>

            <TouchableOpacity onPress={getImageLibrary}>
              <Gallery width={60} height={60} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Trash width={60} height={60} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddPhoto;
