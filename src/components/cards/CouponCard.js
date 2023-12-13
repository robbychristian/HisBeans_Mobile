import React from 'react';
import {View} from 'react-native';
import {Text, Card} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

const CouponCard = ({title, description, validity, onPress}) => {
  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#fff',
      }}>
      <Card style={{backgroundColor: '#fff'}} onPress={onPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="coffee" size={40} style={{marginRight: 30}} />
          <View>
            <Text style={{fontWeight: 'bold'}} category="h6">
              {title}
            </Text>
            <View style={{marginTop: 20}}>
              <Text category="label" appearance="hint">
                {description}
              </Text>
              <Text category="label" appearance="hint">
                {validity}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default CouponCard;
