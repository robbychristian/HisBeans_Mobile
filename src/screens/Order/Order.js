import React, {useState, useEffect} from 'react';
import {api} from '../../../config/api';
import {View, ScrollView, Appearance} from 'react-native';
import {Card, Text} from '@ui-kitten/components';
import {useSelector} from 'react-redux';
import {Button} from '@ui-kitten/components';
import UpdateCard from '../../components/cards/UpdateCard';
import OrderCard from '../../components/cards/OrderCard';

const Order = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const darkMode = Appearance.getColorScheme();
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

    api
      .post('api/getAllCompletedOrders', {
        user_id: userDetails.id,
      })
      .then(response => {
        setCompletedOrders(response.data);
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
      api
        .post('api/getAllCompletedOrders', {
          user_id: userDetails.id,
        })
        .then(response => {
          setCompletedOrders(response.data);
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
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: '90%'}}>
            <Text category="h6">Current Orders</Text>
          </View>
        </View>
        {orders.length > 0 ? (
          orders.map((item, index) => {
            return (
              <OrderCard
                onPress={() => {
                  if (
                    item.order_status == 'Pending' ||
                    item.order_status == 'Completed'
                  ) {
                    navigation.navigate('IndividualOrder', {
                      id: item.id,
                      status: item.order_status,
                      payment: item.payment_status,
                      modeOfPayment: item.mode_of_payment,
                      totalPrice: item.total_price,
                    });
                  }
                }}
                orderNo={item.id}
                status={item.order_status}
                payment={item.payment_status}
                date={item.created_at}
                price={item.total_price}
              />
            );
          })
        ) : (
          <Card>
            <Text style={{textAlign: 'center', color: '#000'}}>
              No pending orders yet!
            </Text>
          </Card>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
          }}>
          <View style={{width: '90%'}}>
            <Text category="h6">Past Orders</Text>
          </View>
        </View>
        {completedOrders.length > 0 ? (
          completedOrders.map((item, index) => {
            return (
              <OrderCard
                onPress={() => {
                  if (
                    item.order_status == 'Pending' ||
                    item.order_status == 'Completed'
                  ) {
                    navigation.navigate('IndividualOrder', {
                      id: item.id,
                      status: item.order_status,
                      payment: item.payment_status,
                      modeOfPayment: item.mode_of_payment,
                      totalPrice: item.total_price,
                    });
                  }
                }}
                orderNo={item.id}
                status={item.order_status}
                payment={item.payment_status}
                date={item.created_at}
                price={item.total_price}
              />
            );
          })
        ) : (
          <Card>
            <Text style={{textAlign: 'center', color: '#000'}}>
              No orders have been completed yet!
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default Order;
