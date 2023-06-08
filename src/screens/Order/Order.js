import React, {useState, useEffect} from 'react';
import {api} from '../../../config/api';
import {View, Text, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {Button} from '@ui-kitten/components';
import UpdateCard from '../../components/cards/UpdateCard';
import OrderCard from '../../components/cards/OrderCard';

const Order = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const {userDetails} = useSelector(state => state.auth);
  useEffect(() => {
    api
      .post('api/getUserOrders', {
        user_id: userDetails.id,
      })
      .then(response => {
        setOrders(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });

    const unsubscribe = navigation.addListener('focus', () => {
      api
        .post('api/getUserOrders', {
          user_id: userDetails.id,
        })
        .then(response => {
          setOrders(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginHorizontal: 15,
          }}>
          <Button
            onPress={() => navigation.navigate('OrderHistory')}
            style={{
              width: '30%',
              borderColor: '#f15a38',
              backgroundColor: '#f15a38',
            }}>
            History
          </Button>
        </View>
        {orders.length > 0
          ? orders.map((item, index) => {
              return (
                <OrderCard
                  onPress={() => {
                    if (item.order_status != 'Cancelled') {
                      navigation.navigate('IndividualOrder', {
                        id: item.id,
                      });
                    }
                  }}
                  orderNo={item.id}
                  status={item.order_status}
                  payment={item.payment_status}
                />
              );
            })
          : null}
      </ScrollView>
    </View>
  );
};

export default Order;
