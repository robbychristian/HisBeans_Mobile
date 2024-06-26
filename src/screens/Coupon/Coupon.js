import React from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Button} from '@ui-kitten/components';
import CouponCard from '../../components/cards/CouponCard';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import {TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {api} from '../../../config/api';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import {useEffect} from 'react';
import {Image} from 'react-native';

const Coupon = ({navigation, route}) => {
  const {userDetails} = useSelector(state => state.auth);
  const [voucherCode, setVoucherCode] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [punchCardCount, setPunchCardCount] = useState(0);
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
      api
        .get(`api/getUserPunchCard/${userDetails.id}`)
        .then(response => {
          setPunchCardCount(Number(response.data[0].punch_card_count));
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
    api
      .get(`api/getUserPunchCard/${userDetails.id}`)
      .then(response => {
        setPunchCardCount(Number(response.data[0].punch_card_count));
      })
      .catch(err => {
        console.log(err.response);
      });
    return unsubscribe;
  }, [navigation, refresher]);

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

  // const RenderPunchCard = () => {
  //   if (punchCardCount > 0) {
  //     for (let i = 0; i < 10; i++) {
  //       if (i < punchCardCount) {
  //         return (
  //           <Image
  //             source={require('../../../assets/logo/logo-circle-white.png')}
  //             style={{width: 50, height: 50, resizeMode: 'contain'}}
  //           />
  //         );
  //       } else {
  //         return (
  //           <Image
  //             source={require('../../../assets/logo/GCash-Logo.png')}
  //             style={{width: 50, height: 50, resizeMode: 'contain'}}
  //           />
  //         );
  //       }
  //     }
  //   }
  // };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            width: '100%',
            paddingVertical: 30,
            backgroundColor: '#F15A38',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../../../assets/logo/logo-white.png')}
              style={{
                height: 100,
                width: '60%',
                resizeMode: 'contain',
                marginTop: -20,
              }}
            />
            {/* <RenderPunchCard /> */}

            <Text style={{color: '#fff'}} category="h6">
              You currently have{' '}
              <Text style={{fontWeight: 'bold', color: '#fff'}} category="h5">
                {punchCardCount}/10
              </Text>{' '}
              punch cards!
            </Text>
            <View style={{paddingHorizontal: 30, marginTop: 15}}>
              <Text category="label" style={{color: '#fff'}}>
                • One (1) drink is equivalent to one (1) stamp. (Not applicable
                to RTD drinks & set menus)
              </Text>
              <Text category="label" style={{color: '#fff'}}>
                • 10th stamp means entitlement to one coffee or drink
              </Text>
            </View>
          </View>
        </View>
        {vouchers.length > 0
          ? vouchers.map((item, index) => {
              return (
                <CouponCard
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

export default Coupon;
