import React from 'react';
import {View} from 'react-native';
import {Card, Text} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UpdateCard = () => {
  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#fff',
      }}>
      <Card style={{backgroundColor: '#eee'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="coffee-outline" size={40} style={{marginRight: 30}} />
          <View>
            <Text style={{fontWeight: 'bold'}}>Order is Complete!</Text>
            <Text>Iced Cafe Latte</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default UpdateCard;
