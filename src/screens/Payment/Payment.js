import React from 'react';
import {View, Image, ScrollView} from 'react-native';
import {Text, Modal, Button, Card} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import {api} from '../../../config/api';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import {Alert} from 'react-native';
import {clearAllInputs, setReferenceNumber} from '../../store/menu/Menu';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Loading from '../../components/Loading';
import {CONSTANTS, JSHmac} from 'react-native-hash';
import Toast from 'react-native-toast-message';
import {Dialog} from 'react-native-simple-dialogs';

const Payment = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState('');
  const {orderInput, totalPrice, voucherId, modeOfPayment} = useSelector(
    state => state.menu,
  );
  const [customDialog, setCustomDialog] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const [mode, setMode] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [applyVoucher, setApplyVoucher] = useState('');
  const [newTotal, setNewTotal] = useState(totalPrice);
  // START DELIVERY STATE
  const [deliveryTotal, setDeliveryTotal] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  // END DELIVERY STATE
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);
  const [quotationData, setQuotationData] = useState(null);
  const {userDetails} = useSelector(state => state.auth);
  const [distance, setDistance] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    console.log(
      orderInput,
      totalPrice,
      voucherId,
      route.params.referenceNumber,
    );
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

  if (route.params.place === 'Delivery') {
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
        setLoading(true);
        // LALAMOVE CONFIG
        Geolocation.getCurrentPosition(
          pos => {
            axios
              .get(
                `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
              )
              .then(async res => {
                setAddress(res.data.display_name);
                const SECRET =
                  'sk_test_EO8bTWNXo86M0byh3gxDcXWFej9Q6Uu1h/idBaQnX+uS35q3LzOr9oVZSu/KvbmL';
                const time = new Date().getTime().toString();
                const method = 'POST';
                const path = '/v3/quotations';
                const body = {
                  data: {
                    serviceType: 'MOTORCYCLE',
                    language: 'en_PH',
                    stops: [
                      {
                        coordinates: {
                          lat: `${pos.coords.latitude}`,
                          lng: `${pos.coords.longitude}`,
                        },
                        address: `${res.data.display_name}`,
                      },
                      {
                        coordinates: {
                          lat: '14.633161983057901',
                          lng: '121.04281522616623',
                        },
                        address:
                          '116 Timog Ave, Diliman, Quezon City, 1103 Metro Manila',
                      },
                    ],
                    item: {
                      // Recommended
                      quantity: '3',
                      weight: 'LESS_THAN_3KG',
                      categories: ['FOOD_DELIVERY'],
                      handlingInstructions: ['KEEP_UPRIGHT'],
                    },
                    isRouteOptimized: true, // optional
                  },
                };
                const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${JSON.stringify(
                  body,
                )}`;
                const SIGNATURE = await JSHmac(
                  rawSignature,
                  SECRET,
                  CONSTANTS.HmacAlgorithms.HmacSHA256,
                );

                console.log('your signature', SIGNATURE.toString());
                const API_KEY = 'pk_test_c8dffbde99c92c70f73f2f38ae3835ef';
                const TOKEN = `${API_KEY}:${time}:${SIGNATURE.toString()}`;

                axios
                  .post(
                    'https://rest.sandbox.lalamove.com/v3/quotations',
                    body,
                    {
                      headers: {
                        Authorization: `hmac ${TOKEN}`,
                        Market: 'PH',
                      },
                    },
                  )
                  .then(response => {
                    setDeliveryTotal(response.data.data.priceBreakdown.total);
                    setDeliveryAddress(res.data.display_name);
                    setQuotationData(response.data);
                    const distanceValue =
                      Number(response.data.data.distance.value) / 1000;
                    setDistance(distanceValue.toFixed(2));
                    setLoading(false);
                  })
                  .catch(err => {
                    setLoading(false);
                    console.log(err.response.data);
                  });
                console.log(pos.coords);
              })
              .catch(err => {
                console.log(err.response);
                setLoading(false);
              });

            console.log(pos);
          },
          error => {
            Alert.alert('GetCurrentPosition Error', JSON.stringify(error));
          },
          {enableHighAccuracy: true},
        );
      });
      return unsubscribe;
    }, [navigation]);
  }

  const submitDeliveryPayment = async () => {
    const formdata = new FormData();
    formdata.append('user_id', userDetails.id);
    formdata.append('total_price', totalPrice);
    formdata.append('mode_of_payment', modeOfPayment);
    formdata.append('type_of_order', route.params.place);
    formdata.append('order_items', JSON.stringify(orderInput));
    formdata.append('voucher_id', voucherId);
    formdata.append('place', route.params.place);
    formdata.append('gcash_ref_number', route.params.referenceNumber);
    formdata.append('delivery_total', deliveryTotal);
    formdata.append('delivery_address', deliveryAddress);

    api
      .post('api/addOrder', formdata)
      .then(response => {
        console.log(response.data);
        Toast.show({
          type: 'success',
          text1: 'Order Sent!',
          text2: 'Your order is now in queue!',
        });
        dispatch(clearAllInputs());
        dispatch(setReferenceNumber(''));
        navigation.navigate('BottomNav');
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  const onSubmitPayment = async () => {
    if (route.params.place === 'Delivery') {
      setCustomDialog(true);
      const SECRET =
        'sk_test_EO8bTWNXo86M0byh3gxDcXWFej9Q6Uu1h/idBaQnX+uS35q3LzOr9oVZSu/KvbmL';
      const time = new Date().getTime().toString();
      const method = 'POST';
      const path = '/v3/orders';
      const body = {
        data: {
          quotationId: quotationData.data.quotationId,
          sender: {
            stopId: quotationData.data.stops[1].stopId,
            name: 'Hisbeans',
            phone: '+639763210089',
          },
          recipients: [
            {
              stopId: quotationData.data.stops[0].stopId,
              name: `${userDetails.fname} ${userDetails.lname}`,
              phone: `+639276054756`,
            },
          ],
          metadata: {
            restaurantOrderId: '230',
            restaurantName: 'HisBeans',
          },
        },
      };
      const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${JSON.stringify(
        body,
      )}`;
      const SIGNATURE = await JSHmac(
        rawSignature,
        SECRET,
        CONSTANTS.HmacAlgorithms.HmacSHA256,
      );
      const API_KEY = 'pk_test_c8dffbde99c92c70f73f2f38ae3835ef';
      const TOKEN = `${API_KEY}:${time}:${SIGNATURE.toString()}`;
      axios
        .post('https://rest.sandbox.lalamove.com/v3/orders', body, {
          headers: {
            Authorization: `hmac ${TOKEN}`,
            Market: 'PH',
          },
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(err => {
          console.log(err.response.data);
        });
    } else {
      const formdata = new FormData();
      formdata.append('user_id', userDetails.id);
      formdata.append('total_price', totalPrice);
      formdata.append('mode_of_payment', modeOfPayment);
      formdata.append('type_of_order', route.params.place);
      formdata.append('order_items', JSON.stringify(orderInput));
      formdata.append('voucher_id', voucherId);
      formdata.append('place', route.params.place);
      formdata.append('gcash_ref_number', route.params.referenceNumber);
      formdata.append('delivery_total', deliveryTotal);
      formdata.append('delivery_address', deliveryAddress);

      api
        .post('api/addOrder', formdata)
        .then(response => {
          console.log(response.data);
          Toast.show({
            type: 'success',
            text1: 'Order Sent!',
            text2: 'Your order is now in queue!',
          });
          dispatch(clearAllInputs());
          dispatch(setReferenceNumber(''));
          navigation.navigate('BottomNav');
        })
        .catch(err => {
          console.log(err.response);
        });
    }
  };

  return (
    <View style={{flex: 1, width: '100%'}}>
      <Loading loading={loading} />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Dialog
          visible={customDialog}
          title={
            <View style={{alignItems: 'center'}}>
              <Text
                category="h4"
                style={{color: '#F25D3B', textAlign: 'center'}}>
                Lalamove Delivery
              </Text>
            </View>
          }
          onTouchOutside={() => setCustomDialog(false)}>
          <View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../../../assets/logo/Lalamove-Logo.png')}
                style={{height: 100, width: 200}}
              />
            </View>
            <Text category="h6">Delivery Price: P {deliveryTotal}</Text>
            <Text category="label" appearance="hint">
              Please make sure that the address is exact and keep in contact
              with the rider!
            </Text>
            <Button
              onPress={() => submitDeliveryPayment()}
              style={{
                borderColor: '#F25D3B',
                backgroundColor: '#F25D3B',
                marginTop: 10,
              }}>
              Proceed
            </Button>
          </View>
        </Dialog>
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
              <Icon name="account-box" size={30} color="#F25D3B" />
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
              <Icon name="view-list-outline" size={30} color="#F25D3B" />
              <Text category="h5" style={{marginLeft: 5}}>
                Order Details
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text category="h6">Mode of payment: </Text>
              <Text category="h6" style={{fontWeight: '400'}}>
                {modeOfPayment}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text category="h6">Total Price: </Text>
              <Text category="h6" style={{fontWeight: '400'}}>
                P{totalPrice}
              </Text>
            </View>
            {mode == 'GCash' ? <CustomTextInput /> : null}
          </View>
        </View>
        {route.params.place == 'Delivery' ? (
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
                <Icon name="motorbike" size={30} color="#F25D3B" />
                <Text category="h5" style={{marginLeft: 5}}>
                  Delivery Details
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  flex: 1,
                }}>
                <Text category="h6" style={{flex: 0.3}}>
                  Address:{' '}
                </Text>
                <Text
                  category="h6"
                  style={{fontWeight: '400', flex: 0.7, textAlign: 'justify'}}>
                  {address}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text category="h6">Distance: </Text>
                <Text category="h6" style={{fontWeight: '400'}}>
                  {distance} km
                </Text>
              </View>
              {mode == 'GCash' ? <CustomTextInput /> : null}
            </View>
          </View>
        ) : null}
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 20,
          }}>
          <Button
            disabled={modeOfPayment == '' ? true : false}
            style={{
              width: '85%',
              backgroundColor: modeOfPayment == '' ? '#dedede' : '#F25D3B',
              borderColor: modeOfPayment == '' ? '#dedede' : '#F25D3B',
            }}
            onPress={() => onSubmitPayment()}>
            Order
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default Payment;
