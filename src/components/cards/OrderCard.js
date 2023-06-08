import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Card, Text, ProgressBar} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

const OrderCard = ({orderNo, status, payment, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#fff',
      }}>
      <Card style={{backgroundColor: '#eee'}} onPress={onPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="coffee-outline" size={40} style={{marginRight: 30}} />
          <View>
            <Text style={{fontWeight: 'bold'}} category="h5">
              Order Number: {orderNo}
            </Text>
            <Text category="label">
              Status:{' '}
              <Text
                category="label"
                status={status == 'Cancelled' ? 'danger' : 'warning'}>
                {status}
              </Text>
            </Text>
            <Text category="label" appearance="hint">
              Payment:{' '}
              <Text
                category="label"
                status={
                  payment == 'Pending'
                    ? 'warning'
                    : payment == 'Refunded'
                    ? 'danger'
                    : 'success'
                }
                appearance="hint">
                {payment}
              </Text>
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default OrderCard;
