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

const Register = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.auth);
  const [fname, setFname] = useState('Robby');
  const [lname, setLname] = useState('De Leon');
  const [username, setUsername] = useState('robby');
  const [cnumber, setCnum] = useState('09750551187');
  const [email, setEmail] = useState('robbychristiandeleon@gmail.com');
  const [password, setPassword] = useState('password');
  const [cpassword, setCpassword] = useState('password');

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
        <Loading loading={loading} />
        <View style={styles.contentContainer}>
          <Image
            source={require('../../../assets/logo/logo-circle-white.png')}
            style={{height: 125, width: 125, marginTop: 25}}
          />
          <View style={{width: '90%'}}>
            <Text
              category="h5"
              style={{
                color: '#f15a38',
                marginTop: 10,
              }}>
              Create an account!
            </Text>
            <CustomTextInput
              value={fname}
              onChangeText={value => setFname(value)}
              placeholder={`First Name`}
            />
            <CustomTextInput
              value={lname}
              onChangeText={value => setLname(value)}
              placeholder={`Last Name`}
            />
            <CustomTextInput
              value={username}
              onChangeText={value => setUsername(value)}
              placeholder={`Username`}
            />
            <CustomTextInput
              value={cnumber}
              onChangeText={value => setCnum(value)}
              keyboardType="numeric"
              placeholder={`Contact Number`}
            />
            <CustomTextInput
              value={email}
              onChangeText={value => setEmail(value)}
              placeholder={`Email`}
            />
            <CustomTextInput
              onChangeText={value => setPassword(value)}
              placeholder={`Password`}
              value={password}
              isPassword={true}
            />
            <CustomTextInput
              onChangeText={value => setCpassword(value)}
              placeholder={`Confirm Password`}
              value={cpassword}
              isPassword={true}
            />
            <Button
              onPress={() => onSubmit()}
              style={{
                width: '100%',
                marginTop: 20,
                marginBottom: 10,
                backgroundColor: '#f15a38',
                borderColor: '#f15a38',
              }}>
              Register
            </Button>
            <TouchableOpacity onPress={() => navigation.push('Login')}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#f15a38',
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
    backgroundColor: '#ffecd3',
    flex: 1,
  },
  contentContainer: {
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Register;
