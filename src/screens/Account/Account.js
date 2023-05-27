import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {Text, Modal, Card} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import QRCode from 'react-qr-code';
import {api} from '../../../config/api';
import {useDispatch, useSelector} from 'react-redux';
import {editProfile, logoutUser} from '../../store/auth/User';

const Account = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const {token, userDetails} = useSelector(state => state.auth);
  const [fname, setFname] = useState(userDetails.fname);
  const [lname, setLname] = useState(userDetails.lname);
  const [email, setEmail] = useState(userDetails.email);
  const [username, setUsername] = useState(userDetails.username);
  const [cnumber, setCnum] = useState(userDetails.cnumber);
  const dispatch = useDispatch();
  const logout = async () => {
    dispatch(logoutUser());
    navigation.navigate('Login');
  };

  useEffect(() => {
    console.log(userDetails);
  }, [fname]);

  const onSubmit = async () => {
    const input = {
      id: userDetails.id,
      fname: fname,
      lname: lname,
      email: email,
      username: username,
      cnumber: cnumber,
    };
    const response = await dispatch(editProfile(input));
    if (response.type === 'auth/editProfile/fulfilled') {
      Alert.alert('Success!', 'Profile has been updated!');
    } else {
      Alert.alert('Error!', 'There was a problem in updating your profile!');
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            flex: 0.3,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'row',
          }}>
          <Icon name="account-circle" size={125} color="#000" />
          <View style={{position: 'absolute', top: 10, right: 10}}>
            <TouchableOpacity
              onPress={() => {
                logout();
              }}
              style={{
                backgroundColor: '#dc3545',
                paddingHorizontal: 8,
                borderRadius: 10,
                paddingVertical: 10,
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          visible={visible}
          onBackdropPress={() => setVisible(false)}
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <Card>
            <QRCode
              size={256}
              style={{height: 'auto', maxWidth: '100%', width: '100%'}}
              value={JSON.stringify(userDetails)}
              viewBox={`0 0 256 256`}
            />
          </Card>
        </Modal>
        <View
          style={{
            flex: 0.7,
            width: '100%',
            alignItems: 'center',
          }}>
          <View style={{width: '90%'}}>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <CustomTextInput
                onChangeText={value => setFname(value)}
                value={fname}
                label={`First Name`}
                isHalf
              />
              <CustomTextInput
                onChangeText={value => setLname(value)}
                value={lname}
                label={`Last Name`}
                isHalf
              />
            </View>
            <CustomTextInput
              onChangeText={value => setEmail(value)}
              value={email}
              my={10}
              label={`Email`}
            />
            <CustomTextInput
              onChangeText={value => setUsername(value)}
              value={username}
              my={10}
              label={`Username`}
            />
            <CustomTextInput
              onChangeText={value => setCnum(value)}
              value={cnumber}
              my={10}
              label={`Mobile No.`}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#23442b',
                paddingHorizontal: 8,
                borderRadius: 10,
                paddingVertical: 10,
              }}
              onPress={() => setVisible(true)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Generate QR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSubmit()}
              style={{
                backgroundColor: '#198754',
                paddingHorizontal: 8,
                borderRadius: 10,
                paddingVertical: 10,
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Update Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Account;
