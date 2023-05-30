import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import {
  BottomNavigation,
  BottomNavigationTab,
  Text,
} from '@ui-kitten/components';
import Menu from '../screens/Menu/Menu';
import Order from '../screens/Order/Order';
import Coupon from '../screens/Coupon/Coupon';
import Account from '../screens/Account/Account';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';
import TopNavigation from './TopNavigation';
import {View} from 'react-native';
import Cart from '../screens/Cart/Cart';
import MenuCustomization from '../screens/Menu/MenuCustomization';

const BottomStack = createBottomTabNavigator();

// const PersonIcon = props => (
//   <Icon {...props} fill="#fff" name="person-outline" />
// );
// const HomeIcon = props => (
//   <Icon {...props} fill="#fff" name="home-outline" />
// );

const BellIcon = props => <Icon {...props} name="bell-outline" />;

const EmailIcon = props => <Icon {...props} name="email-outline" />;

const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    style={{backgroundColor: '#f15a38'}}
    indicatorStyle={{backgroundColor: '#f15a38'}}
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab
      title={() => (
        <Text category="label" style={{color: '#fff'}}>
          Home
        </Text>
      )}
    />
    <BottomNavigationTab
      title={() => (
        <Text category="label" style={{color: '#fff'}}>
          Menu
        </Text>
      )}
    />
    <BottomNavigationTab
      title={() => (
        <Text category="label" style={{color: '#fff'}}>
          Order
        </Text>
      )}
    />
    <BottomNavigationTab
      title={() => (
        <Text category="label" style={{color: '#fff'}}>
          Coupon
        </Text>
      )}
    />
    <BottomNavigationTab
      title={() => (
        <Text category="label" style={{color: '#fff'}}>
          Account
        </Text>
      )}
    />
  </BottomNavigation>
);

const BottomBarNavigation = ({navigation}) => {
  return (
    <BottomStack.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        title: 'HisBeans',
        headerTitleAlign: 'center',
        headerTitleStyle: {color: '#fff'},
        headerStyle: {backgroundColor: '#f15a38'},
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.push('TopNav')}>
              <Icon
                name="inbox-full"
                size={30}
                style={{marginRight: 10}}
                color="#FFF"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Cart')}>
              <Icon
                name="cart"
                size={30}
                style={{marginRight: 10}}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
        ),
      }}>
      <BottomStack.Screen name="Home" component={Home} />
      <BottomStack.Screen name="Menu" component={Menu} />
      <BottomStack.Screen name="Order" component={Order} />
      <BottomStack.Screen name="Coupon" component={Coupon} />
      <BottomStack.Screen name="Account" component={Account} />
      <BottomStack.Screen
        name="MenuCustomization"
        component={MenuCustomization}
      />
    </BottomStack.Navigator>
  );
};

export default BottomBarNavigation;
