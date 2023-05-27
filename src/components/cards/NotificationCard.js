import React from 'react';
import {View} from 'react-native';
import {Card, Text} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationCard = () => {
  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#fff',
      }}>
      <Card style={{backgroundColor: '#eee'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="bullhorn" size={40} style={{marginRight: 30}} />
          <View>
            <Text style={{fontWeight: 'bold'}}>New Voucher Available!</Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
              atque odio corporis, omnis vel quisquam natus aliquam
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default NotificationCard;
