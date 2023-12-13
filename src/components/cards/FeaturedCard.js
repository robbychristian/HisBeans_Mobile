import {Card} from '@ui-kitten/components';
import React from 'react';
import {View, Image} from 'react-native';
import {Text} from '@ui-kitten/components';

const FeaturedCard = ({name, description, price, menuImage, onPress}) => {
  return (
    <Card
      onPress={onPress}
      style={{
        marginRight: 5,
        height: '100%',
        width: 200,
        borderColor: 'transparent',
      }}>
      <Image source={{uri: menuImage}} style={{height: 150, width: 150}} />
      <Text category="h6" style={{textAlign: 'center'}}>
        {name}
      </Text>
      {/* <Text category="label" appearance="hint">
        {description}
      </Text> */}
    </Card>
  );
};

export default FeaturedCard;
