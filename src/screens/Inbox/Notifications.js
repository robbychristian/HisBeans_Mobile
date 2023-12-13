import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {
  Card,
  Icon,
  Text,
  IconElement,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import NotificationCard from '../../components/cards/NotificationCard';
import {api} from '../../../config/api';

const Notifications = ({navigation}) => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    api
      .get('api/getAllNotifications')
      .then(response => {
        setNotifications(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });

    const unsubscribe = navigation.addListener('focus', () => {
      api
        .get('api/getAllNotifications')
        .then(response => {
          setNotifications(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {notifications.length > 0 ? (
          notifications.map((item, index) => {
            return (
              <NotificationCard
                title={item.notification_title}
                description={item.notification_description}
              />
            );
          })
        ) : (
          <Card>
            <Text category="h6" style={{textAlign: 'center'}}>
              No notifications yet
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default Notifications;
