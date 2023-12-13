import React, {useState} from 'react';
import {View, Text} from 'react-native';
import CustomPaperInput from '../../components/inputs/CustomPaperInput';
import {Button} from '@ui-kitten/components';
import Toast from 'react-native-toast-message';

const ChangePassword = ({navigation, route}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confNewPassword, setConfNewPassword] = useState('');

  const onSave = () => {
    if (newPassword != confNewPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Password mismatch!',
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Password has been changed!',
      });
      navigation.goBack();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}>
      <CustomPaperInput
        onChangeText={value => setCurrentPassword(value)}
        label={`Current Password`}
        value={currentPassword}
        isPassword={true}
        textWhite={false}
      />
      <CustomPaperInput
        onChangeText={value => setNewPassword(value)}
        label={`New Password`}
        value={newPassword}
        isPassword={true}
        textWhite={false}
      />
      <CustomPaperInput
        onChangeText={value => setConfNewPassword(value)}
        label={`Confirm New Password`}
        value={confNewPassword}
        isPassword={true}
        textWhite={false}
      />
      <Button
        onPress={() => onSave()}
        style={{
          backgroundColor: '#F25D3B',
          borderColor: '#F25D3B',
          marginTop: 40,
        }}>
        Save
      </Button>
    </View>
  );
};

export default ChangePassword;
