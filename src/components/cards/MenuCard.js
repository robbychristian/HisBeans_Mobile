import React from 'react';
import {View, Image} from 'react-native';
import {Card, Text} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

const MenuCard = ({name, description, price, onPress, icon, menuImage}) => {
  return (
    // <TouchableOpacity
    //   style={{
    //     paddingHorizontal: 15,
    //     paddingVertical: 5,
    //     backgroundColor: '#fff',
    //   }}>
    //   <Card style={{backgroundColor: '#eee'}} onPress={onPress}>
    //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
    //       <Icon name="coffee-outline" size={40} style={{marginRight: 30}} />
    //       <View>
    //         <Text style={{fontWeight: 'bold'}}>{name}</Text>
    //         <Text>{description}</Text>
    //         <Text category="label" appearance="hint">
    //           P{price}
    //         </Text>
    //       </View>
    //     </View>
    //   </Card>
    // </TouchableOpacity>

    <Card
      onPress={onPress}
      style={{
        width: '50%',
        borderColor: 'transparent',
      }}>
      <Image source={{uri: menuImage}} style={{height: 150, width: 150}} />
      <Text category="h6" style={{textAlign: 'center'}}>
        {name}
      </Text>
    </Card>
  );
};

export default MenuCard;
