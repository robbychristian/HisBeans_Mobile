import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {Text, Card, Button} from '@ui-kitten/components';
import {api} from '../../../config/api';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Cart = ({navigation}) => {
  const {userDetails} = useSelector(state => state.auth);
  const [cart, setCart] = useState([]);
  const [cartAddons, setCartAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const submitOrder = () => {
    let orderItems = [];
    cart.map((item, index) => {
      orderItems.push(item);
    });
    const formdata = new FormData();
    formdata.append('user_id', userDetails.id);
    formdata.append('total_price', totalPrice);
    formdata.append('order_items', JSON.stringify(orderItems));

    navigation.navigate('Payment', {
      user_id: userDetails.id,
      total_price: totalPrice,
      order_items: JSON.stringify(orderItems),
    });

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
  }, [navigation]);
  return (
    <View style={{flex: 1, width: '100%'}}>
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
          Your Cart
        </Text>
        <Text category="h5" style={{color: '#fff'}}></Text>
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
                  borderWidth: 0.3,
                  justifyContent: 'space-between',
                  borderColor: '#aeaeae',
                }}>
                <Text category="h6">{item.drink_quantity}x</Text>
                <Text category="h6">
                  {item.item_name} {'\n'}
                  {JSON.parse(item.addons_id).map((addonsItem, addonsIndex) => {
                    return (
                      <Text category="label" appearance="hint">
                        {addonsItem + '\n'}
                      </Text>
                    );
                  })}
                </Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text category="h6">P{item.drink_price}</Text>
              </View>
            );
          })
        ) : (
          <Card style={{alignItems: 'center'}}>
            <Text>No data to display</Text>
          </Card>
        )}
      </ScrollView>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Button
          disabled={cart.length == 0 ? true : false}
          onPress={() => {
            submitOrder();
          }}
          style={{
            width: '90%',
            backgroundColor: cart.length == 0 ? '#dedede' : '#f15a38',
            borderColor: cart.length == 0 ? '#dedede' : '#f15a38',
          }}>
          Payment
        </Button>
      </View>
    </View>
  );
};

export default Cart;
