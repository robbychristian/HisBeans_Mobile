import React from 'react';
import {View} from 'react-native';
import {Card, Text} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

const MenuCard = ({name, description, price, onPress, icon}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#fff',
      }}>
      <Card style={{backgroundColor: '#eee'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="coffee-outline" size={40} style={{marginRight: 30}} />
          <View>
            <Text style={{fontWeight: 'bold'}}>{name}</Text>
            <Text>{description}</Text>
            <Text category="label" appearance="hint">
              P{price}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MenuCard;
