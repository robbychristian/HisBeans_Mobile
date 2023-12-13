import React from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Button} from '@ui-kitten/components';
import CouponCard from '../../components/cards/CouponCard';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import {TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {api} from '../../../config/api';
import {useDispatch, useSelector} from 'react-redux';
import {Alert} from 'react-native';
import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setOrderInput, setVoucherId} from '../../store/menu/Menu';

const Voucher = ({navigation, route}) => {
  const {userDetails} = useSelector(state => state.auth);
  const {voucherId, totalPrice, orderInput} = useSelector(state => state.menu);
  const dispatch = useDispatch();
  const [voucherCode, setVoucherCode] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [refresher, setRefresher] = useState(0); //wala kasing redux huhu

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      api
        .post('api/getUserVouchers', {
          user_id: userDetails.id,
        })
        .then(response => {
          setVouchers(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    });
    api
      .post('api/getUserVouchers', {
        user_id: userDetails.id,
      })
      .then(response => {
        setVouchers(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    return unsubscribe;
  }, [navigation, refresher]);

  const useVoucher = item => {
    const newTotal =
      Number(totalPrice) * (1 - Number(item.voucher_discount) / 100);
    const newPrice = {
      orderInput: orderInput,
      totalPrice: newTotal,
    };
    dispatch(setVoucherId(item.voucher_id));
    dispatch(setOrderInput(newPrice));
    navigation.goBack();
  };

  const addVoucher = () => {
    api
      .post('api/addUserVoucher', {
        user_id: userDetails.id,
        voucher_code: voucherCode,
      })
      .then(response => {
        if (response.data == true) {
          Alert.alert('Voucher Added!', 'The voucher has been added!');
          setRefresher(refresher + 1);
          setVoucherCode('');
        } else {
          Alert.alert('Sorry!', 'Voucher code is not available or expired.');
        }
      })
      .catch(err => {
        Alert.alert('Error!', 'There was a problem with the request.');
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#F25D3B',
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
            Apply Voucher
          </Text>
          <Text category="h5" style={{color: '#fff'}}></Text>
        </View>
        {vouchers.length > 0
          ? vouchers.map((item, index) => {
              return (
                <CouponCard
                  onPress={() => useVoucher(item)}
                  title={item.voucher_name}
                  description={item.promo_details}
                  validity={item.valid_until}
                />
              );
            })
          : null}
      </ScrollView>
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 50,
          marginVertical: 20,
          borderTopWidth: 0.5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <View style={{flex: 0.8}}>
            <CustomTextInput
              placeholder={`Voucher Name`}
              value={voucherCode}
              onChangeText={value => setVoucherCode(value)}
            />
          </View>
          <TouchableOpacity
            style={{
              flex: 0.2,
              marginLeft: 10,
              marginTop: 15,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => addVoucher()}>
            <Text style={{color: '#F25D3B', fontWeight: 'bold'}}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Voucher;
