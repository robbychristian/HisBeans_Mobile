import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import UpdateCard from '../../components/cards/UpdateCard';
import {api} from '../../../config/api';
import {useSelector} from 'react-redux';

const Updates = ({navigation}) => {
  const {userDetails} = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api
      .post('api/getUserPendingOrders', {
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
        .post('api/getUserPendingOrders', {
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
        {orders.length > 0
          ? orders.map((item, index) => {
              if (item.order_status == 'Pending') {
                return (
                  <UpdateCard
                    isPending={item.order_status == 'Pending' ? true : false}
                    status={item.order_status}
                    temperature={item.drink_temperature}
                    name={item.drink_name}
                    quantity={item.drink_quantity}
                    orderNo={item.order_id}
                  />
                );
              }
            })
          : null}
      </ScrollView>
    </View>
  );
};

export default Updates;
