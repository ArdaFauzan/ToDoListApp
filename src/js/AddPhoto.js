import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Camera from '../assets/camera.svg';
import Gallery from '../assets/gallery.svg';
import Trash from '../assets/trashPhoto.svg';
import Axios from 'axios';

const AddPhoto = ({onClose, setUserImageUri}) => {
  const [imageUri, setImageUri] = useState('');

  const postPhotoUser = () => {
    Axios.post(
      `https://to-do-list-app-back-end.vercel.app/todo/uploadphoto/${name}`,
    ).then(res => {
      console.log(res);
    });
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

            <TouchableOpacity onPress={() => {}}>
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
