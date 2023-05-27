import React from 'react';
import {View, ScrollView} from 'react-native';
import UpdateCard from '../../components/cards/UpdateCard';

const Updates = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <UpdateCard />
        <UpdateCard />
        <UpdateCard />
        <UpdateCard />
        <UpdateCard />
        <UpdateCard />
        <UpdateCard />
        <UpdateCard />
        <UpdateCard />
      </ScrollView>
    </View>
  );
};

export default Updates;
