import React from 'react';
import {View} from 'react-native';
import {Card, Text} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationCard = ({title, description}) => {
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
            <Text style={{fontWeight: 'bold'}}>{title}</Text>
            <Text>{description}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default NotificationCard;
