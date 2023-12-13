import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Card, Text, ProgressBar} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';
import moment from 'moment/moment';

const OrderCard = ({orderNo, status, payment, onPress, date, price}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#fff',
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ddd',
        }}
        onPress={onPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: '100%'}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold'}} category="h6">
                Order{' '}
                {status === 'Pending' && payment === 'Completed'
                  ? 'In Progress'
                  : status === 'Pending' || payment === 'Pending'
                  ? 'Pending'
                  : 'Complete'}
              </Text>
              <Text style={{fontWeight: 'bold'}} category="h6">
                P {price}
              </Text>
            </View>
            <Text category="label" appearance="hint">
              Order #{orderNo}
            </Text>
            <Text category="label" appearance="hint">
              {moment(date).format('LL, h:mmA')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default OrderCard;
