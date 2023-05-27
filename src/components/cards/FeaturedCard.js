import {Card} from '@ui-kitten/components';
import React from 'react';
import {View, Image} from 'react-native';
import {Text} from '@ui-kitten/components';

const FeaturedCard = ({name, description, price}) => {
  return (
    <Card style={{marginRight: 5, height: '100%', width: 200}}>
      <Image
        source={require('../../../assets/logo/logo-circle-white.png')}
        style={{height: 150, width: 150}}
      />
      <Text category="h6">{name}</Text>
      <Text category="label" appearance="hint">
        {description}
      </Text>
    </Card>
  );
};

export default FeaturedCard;
