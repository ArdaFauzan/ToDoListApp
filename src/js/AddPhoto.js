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

const AddPhoto = ({onClose}) => {
  const [imageUri, setImageUri] = useState('');

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response) {
        const uri = response.uri;
        // Simpan gambar di penyimpanan lokal dan dapatkan URI-nya
        const localImageUri = saveImageToLocal(uri);
        // Set URI gambar ke state untuk ditampilkan
        setImageUri(localImageUri);
      }
    });
  };

  const saveImageToLocal = uri => {
    const dirs = RNFetchBlob.fs.dirs;
    const localPath = `${dirs.DocumentDir}/local-image.jpg`;
    RNFetchBlob.fs
      .cp(uri, localPath)
      .then(() => console.log('Gambar disimpan di penyimpanan lokal'))
      .catch(error => console.error(error));
    return localPath;
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

            <TouchableOpacity onPress={handleChoosePhoto}>
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
