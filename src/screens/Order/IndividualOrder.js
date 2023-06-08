import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, Button} from '@ui-kitten/components';
import {ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {api} from '../../../config/api';
import UpdateCard from '../../components/cards/UpdateCard';
import {Alert} from 'react-native';

const IndividualOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [orderItems, setOrderItems] = useState([]);
  useEffect(() => {
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
  }, [navigation]);

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
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
            Order No. {route.params.id}
          </Text>
          <Text category="h5" style={{color: '#fff'}}></Text>
        </View>
        {orderItems.length > 0
          ? orderItems.map((item, index) => {
              if (item.order_status == 'Pending') {
                return (
                  <UpdateCard
                    isPending={item.order_status == 'Pending' ? true : false}
                    status={item.order_status}
                    temperature={item.drink_temperature}
                    name={item.drink_name}
                    quantity={item.drink_quantity}
                  />
                );
              }
            })
          : null}
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 15,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
        }}>
        <Button
          status="danger"
          style={{width: '90%'}}
          onPress={() => {
            cancelOrder();
          }}>
          Cancel
        </Button>
      </View>
    </View>
  );
};

export default IndividualOrder;
