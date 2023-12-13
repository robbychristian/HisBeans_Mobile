import React, {useState} from 'react';
import {Button, Layout, Text, CheckBox} from '@ui-kitten/components';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../store/auth/User';
import {api} from '../../../config/api';
import Loading from '../../components/Loading';
import CustomPaperInput from '../../components/inputs/CustomPaperInput';

const Register = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.auth);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [username, setUsername] = useState('');
  const [cnumber, setCnum] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const onSubmit = async () => {
    const input = {
      fname: fname,
      lname: lname,
      username: username,
      email: email,
      password: password,
      role: 'Customer',
      cnumber: cnumber,
      status: 'Enable',
    };
    if (
      fname == '' ||
      lname == '' ||
      username == '' ||
      cnumber == '' ||
      email == '' ||
      password == ''
    ) {
      Alert.alert('Error!', 'Please fill in the form!');
    } else if (password !== cpassword) {
      Alert.alert('Error!', 'Password does not match!');
    } else {
      const response = await dispatch(registerUser(input));
      if (response.type == 'auth/register/fulfilled') {
        Alert.alert('Success!', 'Account has been created!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error!', 'There was a problem in creating your account!');
      }
    }
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {/* <View style={{alignItems: 'center', marginTop: 20}}>
          <Image
            source={require('../../../assets/logo/logo-circle-white.png')}
            style={{height: 125, width: 125, marginTop: 25}}
          />
        </View> */}
        <Loading loading={loading} />
        <View style={styles.contentContainer}>
          <Image
            source={require('../../../assets/logo/logo-filled-orange.png')}
            style={{height: 125, width: 115}}
          />
          <View style={{width: '90%'}}>
            <Text
              category="h5"
              style={{
                color: '#F25D3B',
                marginTop: 10,
                textAlign: 'center',
              }}>
              Create an account!
            </Text>
            <View style={{flexDirection: 'row'}}>
              <CustomPaperInput
                value={fname}
                onChangeText={value => setFname(value)}
                label={`First Name`}
                isHalf={true}
                textWhite={false}
              />
              <CustomPaperInput
                value={lname}
                onChangeText={value => setLname(value)}
                label={`Last Name`}
                isHalf={true}
                textWhite={false}
              />
            </View>
            <CustomPaperInput
              value={username}
              onChangeText={value => setUsername(value)}
              label={`Username`}
              textWhite={false}
            />
            <CustomPaperInput
              value={cnumber}
              onChangeText={value => setCnum(value)}
              keyboardType="numeric"
              label={`Contact Number`}
              textWhite={false}
            />
            <CustomPaperInput
              value={email}
              onChangeText={value => setEmail(value)}
              label={`Email`}
              textWhite={false}
            />
            <View style={{flexDirection: 'row'}}>
              <CustomPaperInput
                onChangeText={value => setPassword(value)}
                label={`Password`}
                value={password}
                isPassword={true}
                textWhite={false}
                isHalf={true}
              />
              <CustomPaperInput
                onChangeText={value => setCpassword(value)}
                label={`Confirm Password`}
                value={cpassword}
                isPassword={true}
                textWhite={false}
                isHalf={true}
              />
            </View>
            <Button
              onPress={() => onSubmit()}
              style={{
                width: '100%',
                marginTop: 20,
                marginBottom: 10,
                backgroundColor: '#F25D3B',
                borderColor: '#F25D3B',
              }}>
              Register
            </Button>
            <TouchableOpacity onPress={() => navigation.push('Login')}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#F25D3B',
                  fontWeight: 'bold',
                }}>
                Already have an account? Login here
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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Register;
