import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Text, Layout, Button} from '@ui-kitten/components';
import {ScrollView} from 'react-native';
import Loading from '../../components/Loading';
import {useState} from 'react';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import {api} from '../../../config/api';
import {Alert} from 'react-native';
import CustomPaperInput from '../../components/inputs/CustomPaperInput';

const ForgotPassword = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const onSubmit = () => {
    setLoading(true);
    api
      .post('api/password/email', {
        email: email,
      })
      .then(response => {
        setLoading(false);
        Alert.alert(
          'Password Reset Sent!',
          'The password reset link has been sent to your email!',
        );
      })
      .catch(err => {
        setLoading(falsee);
        console.log(err.response);
      });
  };
  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Loading loading={loading} />
        <View style={styles.contentContainer}>
          <Image
            source={require('../../../assets/logo/logo-filled-orange.png')}
            style={{height: 125, width: 115}}
          />
          <View style={{width: '90%'}}>
            <CustomPaperInput
              value={email}
              onChangeText={value => setEmail(value)}
              label={`Email`}
              textWhite={false}
              my={10}
            />
            <Button
              onPress={() => onSubmit()}
              style={{
                width: '100%',
                marginBottom: 10,
                marginTop: 20,
                backgroundColor: '#F25D3B',
                borderColor: '#F25D3B',
              }}>
              Send Password Reset Link
            </Button>
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#F25D3B',
                  fontWeight: 'bold',
                }}
                onPress={() => navigation.push('Login')}>
                Remembered your password? Login here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainer: {
    height: '90%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ForgotPassword;
