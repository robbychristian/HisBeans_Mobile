import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import {
  BottomNavigation,
  BottomNavigationTab,
  Text,
} from '@ui-kitten/components';
import {Image} from 'react-native';
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
import Payment from '../screens/Payment/Payment';
import OrderHistory from '../screens/Order/OrderHistory';
import ChangePassword from '../screens/Account/ChangePassword';

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
    style={{backgroundColor: '#F25D3B'}}
    indicatorStyle={{backgroundColor: '#F25D3B'}}
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab
      title={() => <Icon name="home" color={'#fff'} size={30} />}
    />
    <BottomNavigationTab
      title={() => <Icon name="silverware" color={'#fff'} size={30} />}
    />
    <BottomNavigationTab
      title={() => <Icon name="view-list-outline" color={'#fff'} size={30} />}
    />
    <BottomNavigationTab
      title={() => <Icon name="ticket-percent" color={'#fff'} size={30} />}
    />
    <BottomNavigationTab
      title={() => <Icon name="account" color={'#fff'} size={30} />}
    />
  </BottomNavigation>
);

const BottomBarNavigation = ({navigation}) => {
  return (
    <BottomStack.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerTitle: props => (
          <Image
            source={require('../../assets/logo/logo-black.png')}
            style={{width: 150, height: 30}}
          />
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {color: '#000'},
        headerStyle: {backgroundColor: '#fff'},
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.push('TopNav')}>
              <Icon
                name="inbox-full"
                size={30}
                style={{marginRight: 10}}
                color="#F25D3B"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Cart')}>
              <Icon
                name="cart"
                size={30}
                style={{marginRight: 10}}
                color="#F25D3B"
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
      <BottomStack.Screen name="OrderHistory" component={OrderHistory} />
      <BottomStack.Screen name="ChangePassword" component={ChangePassword} />
    </BottomStack.Navigator>
  );
};

export default BottomBarNavigation;
