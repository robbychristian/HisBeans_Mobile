import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {
  Icon,
  IconElement,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import NotificationCard from '../../components/cards/NotificationCard';

const Notifications = () => {
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
      </ScrollView>
    </View>
  );
};

export default Notifications;
