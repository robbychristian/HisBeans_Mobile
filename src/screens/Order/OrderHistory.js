import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text, Card} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {api} from '../../../config/api';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native';
import OrderCard from '../../components/cards/OrderCard';

const OrderHistory = () => {
  const navigation = useNavigation();
  const {userDetails} = useSelector(state => state.auth);
  const [allOrders, setAllOrders] = useState([]);
  useEffect(() => {
    api
      .post('api/getAllCompletedOrders', {
        user_id: userDetails.id,
      })
      .then(response => {
        setAllOrders(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    const unsubscribe = navigation.addListener('focus', () => {
      api
        .post('api/getAllCompletedOrders', {
          user_id: userDetails.id,
        })
        .then(response => {
          setAllOrders(response.data);
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
        {allOrders.length > 0 ? (
          allOrders.map((item, index) => {
            return (
              <OrderCard
                orderNo={item.id}
                status={item.order_status}
                payment={item.payment_status}
              />
            );
          })
        ) : (
          <Card>
            <Text style={{textAlign: 'center'}}>
              No orders have been completed yet!
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderHistory;
