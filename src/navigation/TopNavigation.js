import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TabBar, Tab, Layout, Text} from '@ui-kitten/components';
import Notifications from '../screens/Inbox/Notifications';
import Updates from '../screens/Inbox/Updates';

const TopBarNavigation = createMaterialTopTabNavigator();

const TopBar = ({navigation, state}) => (
  <TabBar
    style={{backgroundColor: '#f15a38', paddingVertical: 20}}
    indicatorStyle={{backgroundColor: '#f15a38'}}
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <Tab
      title={() => (
        <Text style={{color: '#fff', fontWeight: 'bold'}}>Updates</Text>
      )}
    />
    <Tab
      title={() => (
        <Text style={{color: '#fff', fontWeight: 'bold'}}>Notifications</Text>
      )}
    />
  </TabBar>
);

const TopNavigation = () => {
  return (
    <TopBarNavigation.Navigator tabBar={props => <TopBar {...props} />}>
      <TopBarNavigation.Screen name="Updates" component={Updates} />
      <TopBarNavigation.Screen name="Notifications" component={Notifications} />
    </TopBarNavigation.Navigator>
  );
};

export default TopNavigation;
