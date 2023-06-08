import React from 'react';
import {View, Image, ScrollView} from 'react-native';
import {Text, Modal, Button, Card} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import {api} from '../../../config/api';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import {Alert} from 'react-native';

const Payment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [mode, setMode] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [applyVoucher, setApplyVoucher] = useState('');
  const [voucherId, setVoucherId] = useState(null);
  const [newTotal, setNewTotal] = useState(route.params.total_price);
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);
  const {userDetails} = useSelector(state => state.auth);

  useEffect(() => {
    api
      .get('api/useVoucher')
      .then(response => {
        setVouchers(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    const unsubscribe = navigation.addListener('blur', () => {
      setMode('');
      api
        .get('api/useVoucher')
        .then(response => {
          setVouchers(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    });
    return unsubscribe;
  }, [navigation]);

  const onSubmitPayment = () => {
    const formdata = new FormData();
    formdata.append('user_id', route.params.user_id);
    formdata.append('total_price', newTotal);
    formdata.append('mode_of_payment', mode);
    formdata.append('order_items', route.params.order_items);
    formdata.append('voucher_id', voucherId);

    api
      .post('api/addOrder', formdata)
      .then(response => {
        console.log(response.data);
        Alert.alert('Order Sent!', 'Your order is not in queue!');
        navigation.navigate('BottomNav');
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  return (
    <View style={{flex: 1, width: '100%'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#f15a38',
            paddingHorizontal: 10,
            paddingVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Icon
            name="arrow-left"
            size={30}
            color={'#fff'}
            onPress={() => navigation.goBack()}
          />
          <Text category="h5" style={{color: '#fff', marginRight: 30}}>
            Payment
          </Text>
          <Text category="h5" style={{color: '#fff'}}></Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              paddingHorizontal: 25,
              paddingVertical: 15,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="account-box" size={30} color="#f15a38" />
              <Text category="h5">Customer Details</Text>
            </View>
            <Text category="h6">
              Name:{' '}
              <Text
                style={{
                  fontWeight: 'normal',
                }}>{`${userDetails.fname} ${userDetails.lname}`}</Text>
            </Text>
            <Text category="h6">
              Contact No:{' '}
              <Text style={{fontWeight: 'normal'}}>{userDetails.cnumber}</Text>
            </Text>
            <Text category="h6">
              Username:{' '}
              <Text style={{fontWeight: 'normal'}}>{userDetails.username}</Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              paddingHorizontal: 25,
              paddingVertical: 15,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="cash-multiple" size={30} color="#f15a38" />
              <Text category="h5" style={{marginLeft: 5}}>
                Payment Method
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setMode('Cash')}
                style={{
                  borderRadius: 4,
                  margin: 2,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  backgroundColor: mode == 'Cash' ? '#fff' : '#ddd',
                  borderWidth: 2,
                  borderColor: mode != 'Cash' ? '#dedede' : '#f15a38',
                }}>
                <Text category="h6" style={{width: 100, textAlign: 'center'}}>
                  Cash
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode('GCash')}
                style={{
                  borderRadius: 4,
                  margin: 2,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  backgroundColor: mode == 'GCash' ? '#fff' : '#ddd',
                  borderWidth: 2,
                  borderColor: mode != 'GCash' ? '#dedede' : '#f15a38',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../../assets/logo/GCash-Logo.png')}
                  style={{height: 25, width: 100}}
                />
              </TouchableOpacity>
            </View>
            {mode == 'GCash' ? (
              <Image
                source={require('../../../assets/logo/GCash-Logo.png')}
                style={{width: 100, height: 25}}
              />
            ) : null}
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={{
              width: '85%',
              backgroundColor: '#fff',
              paddingHorizontal: 25,
              paddingVertical: 15,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="ticket-percent" size={30} color="#f15a38" />
              <Text category="h5" style={{marginLeft: 5}}>
                Apply Voucher{' '}
                <Text category="label" appearance="hint">
                  {applyVoucher != ''
                    ? String(applyVoucher[0].voucher_name)
                    : null}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              paddingHorizontal: 25,
              paddingVertical: 15,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text category="h5" style={{marginLeft: 5}}>
                Apply Senior Citizen/PWD Discount
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 20,
          }}>
          <Button
            disabled={mode == '' ? true : false}
            style={{
              width: '85%',
              backgroundColor: mode == '' ? '#dedede' : '#f15a38',
              borderColor: mode == '' ? '#dedede' : '#f15a38',
            }}
            onPress={() => onSubmitPayment()}>
            Order
          </Button>
        </View>
      </ScrollView>
      <Modal
        visible={visible}
        backdropStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={true} style={{width: 350}}>
          <Text category="h4" style={{color: '#f15a38'}}>
            Voucher Code
          </Text>
          <CustomTextInput
            label={`Code`}
            my={10}
            value={code}
            onChangeText={value => setCode(value)}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              appearance="outline"
              status="danger"
              style={{backgroundColor: '#fff', borderColor: '#f15a38'}}
              onPress={() => {
                setApplyVoucher('');
                setVisible(false);
                setNewTotal(route.params.total_price);
              }}>
              REMOVE
            </Button>
            <Button
              style={{backgroundColor: '#f15a38', borderColor: '#f15a38'}}
              onPress={() => {
                let v = vouchers.filter(item => item.voucher_code == code);
                setApplyVoucher(v);
                let total = route.params.total_price;
                if (v[0].discount_type === 'Percent') {
                  total =
                    Number(total) * (1 - Number(v[0].voucher_discount) / 100);
                } else {
                  total = Number(total) - Number(v[0].voucher_discount);
                }
                setNewTotal(total);
                setVoucherId(v[0].id);
                setVisible(false);
              }}>
              APPLY
            </Button>
          </View>
        </Card>
      </Modal>
    </View>
  );
};

export default Payment;
