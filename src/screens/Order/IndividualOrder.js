import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import {Text, Button} from '@ui-kitten/components';
import {ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {api} from '../../../config/api';
import UpdateCard from '../../components/cards/UpdateCard';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';

const IndividualOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [orderItems, setOrderItems] = useState([]);
  const [countRefresher, setCountRefresher] = useState(0);
  useEffect(() => {
    api
      .post('api/getSpecificOrder', {
        id: route.params.id,
      })
      .then(response => {
        setOrderItems(response.data);
        console.log(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    const unsubscribe = navigation.addListener('focus', () => {
      api
        .post('api/getSpecificOrder', {
          id: route.params.id,
        })
        .then(response => {
          setOrderItems(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    });
    return unsubscribe;
  }, [navigation, countRefresher]);

  const cancelOrder = () => {
    api
      .post('api/cancelOrder', {
        id: route.params.id,
      })
      .then(response => {
        console.log(response.data);
        Alert.alert(
          'Order Cancelled!',
          'Your order has been cancelled. Please proceed to the cashier to get your refund.',
        );
        navigation.goBack();
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  return (
    <View style={{flex: 1}}>
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
            Order No. {route.params.id}
          </Text>
          <Text category="h5" style={{color: '#fff'}}></Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../../assets/logo/logo-filled-orange.png')}
            style={{height: 107, width: 100, marginVertical: 20}}
          />
          <Text category="h5" style={{marginBottom: 10}}>
            Order{' '}
            {route.params.status === 'Pending' &&
            route.params.payment === 'Completed'
              ? 'In Progress'
              : route.params.status === 'Pending' ||
                route.params.payment === 'Pending'
              ? 'Pending'
              : 'Complete'}
          </Text>
        </View>
        {/* {orderItems.length > 0
          ? orderItems.map((item, index) => {
              if (item.order_status == 'Pending') {
                return (
                  <UpdateCard
                    id={item.id}
                    status={item.order_status}
                    temperature={item.drink_temperature}
                    name={item.drink_name}
                    quantity={item.drink_quantity}
                    isFavorite={item.is_favorite}
                  />
                );
              } else {
                return (
                  <UpdateCard
                    id={item.id}
                    status={item.order_status}
                    temperature={item.drink_temperature}
                    name={item.drink_name}
                    quantity={item.drink_quantity}
                    isFavorite={item.is_favorite}
                  />
                );
              }
            })
          : null} */}
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingVertical: 15,
              width: '85%',
              borderRadius: 10,
            }}>
            <Text category="h6">Order Summary</Text>
            {orderItems.order_items !== undefined
              ? orderItems.order_items.length > 0
                ? orderItems.order_items.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          paddingVertical: 10,
                          justifyContent: 'space-between',
                          borderColor: '#aeaeae',
                        }}>
                        <Icon
                          name={item.is_favorite ? 'star' : 'star-outline'}
                          size={30}
                          color={`#ffc107`}
                          onPress={() => {
                            if (item.is_favorite) {
                              api
                                .post('api/removeToFavorites', {
                                  id: item.id,
                                })
                                .then(response => {
                                  console.log(response.data);
                                  setCountRefresher(countRefresher + 1);
                                  Toast.show({
                                    type: 'success',
                                    text1: 'Success!',
                                    text2: `${item.drink_name} has been removed to your favorites`,
                                    visibilityTime: 4000,
                                  });
                                })
                                .catch(err => {
                                  console.log(err.response);
                                });
                            } else {
                              api
                                .post('api/addToFavorites', {
                                  id: item.id,
                                })
                                .then(response => {
                                  console.log(response.data);
                                  setCountRefresher(countRefresher + 1);
                                  Toast.show({
                                    type: 'success',
                                    text1: 'Success!',
                                    text2: `${item.drink_name} has been added to your favorites`,
                                    visibilityTime: 4000,
                                  });
                                })
                                .catch(err => {
                                  console.log(err.response);
                                });
                            }
                          }}
                        />
                        <Text>{item.drink_quantity}x</Text>
                        <Text style={{width: 200, fontWeight: 'bold'}}>
                          {' '}
                          {item.drink_name} {'\n'}
                          <Text category="label" appearance="hint">
                            {item.drink_temperature} {'\n'}
                          </Text>
                          {JSON.parse(item.addons_id).map(
                            (addonsItem, addonsIndex) => {
                              if (
                                JSON.parse(item.addons_id).length - 1 ==
                                addonsIndex
                              ) {
                                return (
                                  <Text category="label" appearance="hint">
                                    {addonsItem}
                                  </Text>
                                );
                              } else {
                                return (
                                  <Text category="label" appearance="hint">
                                    {addonsItem + '\n'}
                                  </Text>
                                );
                              }
                            },
                          )}
                        </Text>
                        <Text></Text>
                        <Text></Text>
                        <Text></Text>
                        <Text></Text>
                        <Text>₱ {item.drink_price}</Text>
                      </View>
                    );
                  })
                : null
              : null}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Subtotal</Text>
              <Text>₱ {route.params.totalPrice}</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text category="h6">Total</Text>
              <Text category="h6">₱ {route.params.totalPrice}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingVertical: 15,
              width: '85%',
              borderRadius: 10,
              marginTop: 20,
            }}>
            <Text category="h6">Payment</Text>
            {route.params.modeOfPayment == 'Cash' ? (
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View
                  style={{
                    padding: 6,
                    backgroundColor: '#999',
                    borderRadius: 100,
                    marginRight: 10,
                  }}>
                  <Icon name="currency-php" size={15} color={'#fff'} />
                </View>
                <Text category="h6">{route.params.modeOfPayment}</Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    borderRadius: 100,
                    marginRight: 10,
                  }}>
                  <Image
                    source={require('../../../assets/logo/GCash-Logo.png')}
                    style={{height: 50, width: 100}}
                  />
                </View>
              </View>
            )}
          </View>
          {orderItems.delivery_data ? (
            <View
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 20,
                paddingVertical: 15,
                width: '85%',
                borderRadius: 10,
                marginTop: 20,
              }}>
              <Text category="h6">Delivery Payment</Text>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    borderRadius: 100,
                    marginRight: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <Image
                    source={require('../../../assets/logo/Lalamove-Logo.png')}
                    style={{height: 50, width: 100}}
                  />
                  <Text category="h6">
                    ₱{' '}
                    {orderItems.delivery_data
                      ? orderItems.delivery_data.delivery_total
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 20,
            width: '100%',
          }}>
          <Button
            disabled={
              route.params.status == 'Completed'
                ? true
                : route.params.status === 'Pending' &&
                  route.params.payment === 'Completed'
                ? true
                : false
            }
            status="danger"
            style={{width: '90%'}}
            onPress={() => {
              cancelOrder();
            }}>
            Cancel
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default IndividualOrder;
