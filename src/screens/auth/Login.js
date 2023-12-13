import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text, Layout, Button} from '@ui-kitten/components';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../components/Loading';
import {loginUser} from '../../store/auth/User';
import {api} from '../../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPaperInput from '../../components/inputs/CustomPaperInput';

const Login = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {loading, token} = useSelector(state => state.auth);

  useEffect(() => {
    (async () => {
      // console.log('nasa login ka');
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      if (username !== undefined || password !== undefined) {
        const input = {
          username: JSON.parse(username),
          password: JSON.parse(password),
        };
        const response = await dispatch(loginUser(input));
        // console.log(response);
        if (response.payload.data.user.role == 'Customer') {
          if (response.type == 'auth/login/fulfilled') {
            navigation.navigate('BottomNav');
          }
        } else {
          Alert.alert('Error!', 'Only customers can login to this app.');
        }
      } else if (username == '' || password == '') {
      }
    })();
  }, []);

  const onSubmit = async () => {
    if (username == '' || password == '') {
      Alert.alert('Error!', 'Please fill in the form to login.');
    } else {
      const input = {
        username,
        password,
      };
      const response = await dispatch(loginUser(input));
      console.log(response.data);
      if (response.payload.data.user.role == 'Customer') {
        if (response.type == 'auth/login/fulfilled') {
          navigation.navigate('BottomNav');
        } else {
          Alert.alert('Error!', 'Invalid Credentials');
        }
      } else {
        Alert.alert('Error!', 'Only customers can login to this app.');
      }
    }
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Loading loading={loading} />
        <View style={styles.contentContainer}>
          <Image
            source={require('../../../assets/logo/logo-filled-beige.png')}
            style={{height: 220, width: 200}}
          />
          <View style={{width: '90%'}}>
            <CustomPaperInput
              value={username}
              onChangeText={value => setUsername(value)}
              label={`Username`}
              my={10}
              textWhite={true}
            />
            <CustomPaperInput
              value={password}
              onChangeText={value => setPassword(value)}
              label={`Password`}
              isPassword
              my={10}
              textWhite={true}
            />
            <Button
              onPress={() => onSubmit()}
              style={{
                width: '100%',
                marginBottom: 10,
                marginTop: 20,
                backgroundColor: '#FDEBD3',
                borderColor: '#FDEBD3',
              }}>
              <Text style={{color: '#000'}}></Text>
              <Text style={{color: '#F25D3B'}}>Login</Text>
            </Button>
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                }}
                onPress={() => navigation.push('Register')}>
                Don't have an account yet? Register here
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                }}
                onPress={() => navigation.push('ForgotPassword')}>
                Forgot password
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
    backgroundColor: '#F6775B',
    flex: 1,
  },
  contentContainer: {
    height: '90%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login;
