import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Image, View} from 'react-native';
import {Text, Card, Button, Modal} from '@ui-kitten/components';
import {api} from '../../../config/api';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import {setModeOfPayment, setOrderInput} from '../../store/menu/Menu';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import {Linking} from 'react-native';
import {JSHmac, CONSTANTS} from 'react-native-hash';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Loading from '../../components/Loading';

const Cart = ({navigation}) => {
  const {userDetails} = useSelector(state => state.auth);
  const {totalPrice, modeOfPayment, referenceNumber} = useSelector(
    state => state.menu,
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [code, setCode] = useState('');
  const [cartAddons, setCartAddons] = useState([]);
  const [applyVoucher, setApplyVoucher] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [pwd, setPwd] = useState(false);
  const [voucherId, setVoucherId] = useState(0);
  const [visible, setVisible] = useState(false);
  const [baseTotalPrice, setTotalPrice] = useState(0);
  const [place, setPlace] = useState('Dine In');
  const [refresher, setRefresher] = useState(0);
  const [address, setAddress] = useState('');
  const [shortAddress, setShortAddress] = useState('');

  Geolocation.setRNConfiguration({
    skipPermissionRequests: true,
    authorizationLevel: 'always',
    locationProvider: 'auto',
  });

  const submitOrder = async () => {
    let orderItems = [];
    if (modeOfPayment === 'GCash' && referenceNumber == '') {
      Toast.show({
        type: 'error',
        text1: 'Warning!',
        text2: 'Please make sure that you have a GCash reference number!',
        visibilityTime: 4000,
      });
    } else {
      cart.map((item, index) => {
        orderItems.push(item);
      });
      const formdata = new FormData();
      formdata.append('user_id', userDetails.id);
      formdata.append('total_price', baseTotalPrice);
      formdata.append('order_items', JSON.stringify(orderItems));

      if (totalPrice != undefined) {
        const dispatchInput = {
          orderInput: orderItems,
          totalPrice: totalPrice,
        };
        dispatch(setOrderInput(dispatchInput));
        navigation.navigate('Payment', {
          referenceNumber: referenceNumber,
          place: place,
        });
      } else {
        const dispatchInput = {
          orderInput: orderItems,
          totalPrice: baseTotalPrice,
        };
        dispatch(setOrderInput(dispatchInput));
        navigation.navigate('Payment', {
          referenceNumber: referenceNumber,
          place: place,
        });
      }
    }

    // api
    //   .post('api/addOrder', formdata)
    //   .then(response => {
    //     console.log(response.data);
    //     Alert.alert('Order Sent!', 'Your order is now in queue!');
    //     navigation.goBack();
    //   })
    //   .catch(err => {
    //     console.log(err.response);
    //   });
  };

  useEffect(() => {
    let cartArr = [];
    const requestPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Allow access location?',
            message:
              'The app requires you to allow access to proceed in delivery.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestPermission();

    api
      .get('api/useVoucher')
      .then(response => {
        setVouchers(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    api
      .post('api/getUserCart', {
        id: userDetails.id,
      })
      .then(response => {
        const tempArr = response.data;
        let tempPrice = 0;

        tempArr.map((item, index) => {
          tempPrice = tempPrice + Number(item.drink_price);
        });
        setTotalPrice(tempPrice);
        setCart(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    const unsubscribe = navigation.addListener('focus', () => {
      let cartArr = [];
      api
        .get('api/useVoucher')
        .then(response => {
          setVouchers(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
      api
        .post('api/getUserCart', {
          id: userDetails.id,
        })
        .then(response => {
          const tempArr = response.data;
          tempArr.map((item, index) => {
            tempPrice = tempPrice + Number(item.drink_price);
          });
          setTotalPrice(tempPrice);
          setCart(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    });
    return unsubscribe;
  }, [navigation, refresher]);
  return (
    <View style={{flex: 1, width: '100%', backgroundColor: '#fff'}}>
      <Loading loading={loading} />
      <View
        style={{
          width: '100%',
          backgroundColor: '#fff',
          paddingHorizontal: 10,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Icon
          name="arrow-left"
          size={30}
          color={'#F25D3B'}
          onPress={() => navigation.goBack()}
        />
        <Text category="h5" style={{color: '#000', marginRight: 30}}>
          Order Confirmation
        </Text>
        <Text category="h5" style={{color: '#fff'}}></Text>
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginHorizontal: 20,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: place === 'Dine In' ? '#ddd' : '#fff',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}
            onPress={() => setPlace('Dine In')}>
            <Icon name="table-chair" size={25} color={'#F25D3B'} />
            <Text category="h6" style={{marginLeft: 10}}>
              Dine In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: place === 'To go' ? '#ddd' : '#fff',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}
            onPress={() => setPlace('To go')}>
            <Icon name="shopping" size={25} color={'#F25D3B'} />
            <Text category="h6" style={{marginLeft: 10}}>
              To-go
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: place === 'Delivery' ? '#ddd' : '#fff',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}
            onPress={() => {
              setPlace('Delivery');
              setLoading(true);
              dispatch(setModeOfPayment('GCash'));
              Geolocation.getCurrentPosition(
                pos => {
                  axios
                    .get(
                      `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
                    )
                    .then(async response => {
                      setShortAddress(response.data.address.building);
                      setAddress(response.data.display_name);
                      setLoading(false);
                    })
                    .catch(err => {
                      setLoading(false);
                    });
                },
                error =>
                  Alert.alert(
                    'GetCurrentPosition Error',
                    JSON.stringify(error),
                  ),
                {enableHighAccuracy: true},
              );
            }}>
            <Icon name="bike-fast" size={25} color={'#F25D3B'} />
            <Text category="h6" style={{marginLeft: 10}}>
              Delivery
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: '85%'}}>
            <View
              style={{
                backgroundColor: '#FFF3F0',
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text category="label">
                {place === 'Dine In'
                  ? 'This is a dine-in order'
                  : place === 'To go'
                  ? 'This is a self-pick up order'
                  : 'This is a delivery order'}
              </Text>
              <Text category="label" style={{fontWeight: '400'}}>
                {place === 'Dine In'
                  ? `Remember to collect your order at\nthe counter when it’s ready!`
                  : place === 'To go'
                  ? 'Remember to collect your order at the restaurant\nwhen it’s ready!'
                  : 'Delivery charge is excluded from your total order. Please prepare exact amount for your delivery payment! To view delivery fee, please check order status.'}
              </Text>
            </View>
            {place === 'Delivery' && (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderColor: '#ddd',
                  flex: 1,
                  flexDirection: 'row',
                  marginVertical: 8,
                }}>
                <View style={{flex: 0.2}}>
                  <Icon name="map-marker-circle" size={40} color={'#F25D3B'} />
                </View>
                <View style={{flex: 0.8}}>
                  <Text category="h6">{shortAddress}</Text>
                  <Text category="label" style={{fontWeight: '400'}}>
                    {address}
                  </Text>
                </View>
              </View>
            )}
            <Text category="h5">Order Summary</Text>
            {cart.length > 0 ? (
              cart.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      backgroundColor: '#fff',
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      justifyContent: 'space-between',
                      borderColor: '#aeaeae',
                    }}>
                    <Icon
                      name="trash-can"
                      size={30}
                      color={'#dc3545'}
                      onPress={() => {
                        Alert.alert(
                          'Remove from cart?',
                          `Are you sure you want to remove ${item.item_name} from your cart?`,
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel'),
                              style: 'cancel',
                            },
                            {
                              text: 'YES',
                              onPress: () => {
                                api
                                  .post('api/removeToCart', {
                                    cart_id: item.id,
                                  })
                                  .then(response => {
                                    setRefresher(refresher + 1);
                                  })
                                  .catch(err => {
                                    console.log(err.response);
                                  });
                              },
                            },
                          ],
                        );
                      }}
                    />
                    <Text category="h6">{item.drink_quantity}x</Text>
                    <Text category="h6" style={{width: 200}}>
                      {item.item_name} {'\n'}
                      {JSON.parse(item.addons_id).map(
                        (addonsItem, addonsIndex) => {
                          return (
                            <Text category="label" appearance="hint">
                              {addonsItem + '\n'}
                            </Text>
                          );
                        },
                      )}
                    </Text>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Text category="h6">₱ {item.drink_price}</Text>
                  </View>
                );
              })
            ) : (
              <View style={{alignItems: 'center', paddingVertical: 20}}>
                <Text>No data to display</Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View
            onPress={() => setVisible(true)}
            style={{
              width: '85%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                let orderItems = [];
                cart.map((item, index) => {
                  orderItems.push(item);
                });
                const dispatchInput = {
                  orderInput: orderItems,
                  totalPrice: baseTotalPrice,
                };

                dispatch(setOrderInput(dispatchInput));
                navigation.navigate('Voucher');
              }}>
              <Text category="h6" style={{color: '#F25D3B'}}>
                Apply Voucher
              </Text>
            </TouchableOpacity>
            <View>
              <Text category="h6" style={{color: '#000'}}>
                {applyVoucher != ''
                  ? String(applyVoucher[0].voucher_name)
                  : null}
              </Text>
              {applyVoucher != '' ? (
                <TouchableOpacity
                  onPress={() => {
                    setApplyVoucher('');
                    let subTotal = 0;
                    cart.map((item, index) => {
                      subTotal = Number(subTotal) + Number(item.drink_price);
                    });
                    setTotalPrice(subTotal);
                  }}
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <Text category="label" status="danger">
                    Remove
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <Modal
            visible={visible}
            backdropStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onBackdropPress={() => setVisible(false)}>
            <Card disabled={true} style={{width: 350}}>
              <Text category="h4" style={{color: '#F25D3B'}}>
                Voucher Code
              </Text>
              <CustomTextInput
                label={`Code`}
                my={10}
                value={code}
                onChangeText={value => setCode(value)}
              />
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Button
                  style={{backgroundColor: '#F25D3B', borderColor: '#F25D3B'}}
                  onPress={() => {
                    let v = vouchers.filter(item => item.voucher_code == code);
                    setApplyVoucher(v);
                    let total = totalPrice;
                    if (v[0].discount_type === 'Percent') {
                      total =
                        Number(total) *
                        (1 - Number(v[0].voucher_discount) / 100);
                    } else {
                      total = Number(total) - Number(v[0].voucher_discount);
                    }
                    console.log(total);
                    setTotalPrice(total);
                    setVoucherId(v[0].id);
                    setVisible(false);
                  }}>
                  APPLY
                </Button>
              </View>
            </Card>
          </Modal>
        </View>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View
            onPress={() => setVisible(true)}
            style={{
              width: '85%',
              backgroundColor: '#eee',
              paddingHorizontal: 20,
              paddingVertical: 15,
              justifyContent: 'space-between',
            }}>
            <View>
              <Text category="h6" style={{color: '#000'}}>
                Payment Details
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PaymentMethod');
              }}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="cash-multiple" color="#F25D3B" size={30} />
                <Text category="h6" style={{color: '#000', marginLeft: 10}}>
                  {modeOfPayment}
                </Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Icon name="chevron-right" size={30} />
              </View>
            </TouchableOpacity>
            {modeOfPayment === 'GCash' ? (
              <View>
                <CustomTextInput
                  isDisabled={true}
                  label={`Gcash Reference Number`}
                  value={referenceNumber}
                  onChangeText={value => dispatch(setReferenceNumber(value))}
                />
              </View>
            ) : null}
          </View>
        </View>
        {/* <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View
            onPress={() => setVisible(true)}
            style={{
              width: '85%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{width: 250}}
              onPress={() => {
                setPwd(!pwd);
                if (pwd) {
                  let discPrice = totalPrice * (1 - 0.2);
                  setTotalPrice(discPrice);
                }
              }}>
              <Text category="h6" style={{color: '#F25D3B'}}>
                Apply Senior Citizen {'\n'}/PWD Discount
              </Text>
            </TouchableOpacity>
            <View>
              <Text category="h6" style={{color: '#000'}}>
                {pwd ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View> */}
      </ScrollView>
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 100,
          marginVertical: 20,
          borderTopWidth: 0.5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '85%',
            marginTop: 15,
          }}>
          <Text category="h6">Total</Text>
          <Text category="h6">
            ₱{' '}
            {totalPrice == undefined || totalPrice == 0
              ? baseTotalPrice
              : totalPrice}
          </Text>
        </View>
        <Button
          disabled={cart.length == 0 ? true : false}
          onPress={() => {
            submitOrder();
          }}
          style={{
            width: '90%',
            backgroundColor: cart.length == 0 ? '#dedede' : '#F25D3B',
            borderColor: cart.length == 0 ? '#dedede' : '#F25D3B',
          }}>
          Payment
        </Button>
      </View>
    </View>
  );
};

export default Cart;
